import { Command } from 'commander';
import prompts from 'prompts';
import { uploadFile } from '../utils/uploader';
import { getConfig } from '../utils/config';
import path from 'path';

export const uploadCommand = new Command('upload')
  .description('Upload a file to the configured S3/R2 bucket')
  .argument('<filePath>', 'Path to the file to upload')
  .action(async (filePath) => {
    try {
      let config = getConfig();
      if (!config) {
        console.error(
          'Configuration not found. Please run `configure` first.'
        );
        return;
      }

      if (!config.accountId) {
        console.warn(
          'R2 Account ID is not configured. Please provide it now.'
        );
        const accountIdResponse = await prompts({
          type: 'text',
          name: 'accountId',
          message: 'R2 Account ID:',
        });
        config = { ...config, accountId: accountIdResponse.accountId };
      }

      const { bucketName } = config;

      const questions: prompts.PromptObject<string>[] = [
        {
          type: 'text',
          name: 'key',
          message: 'Enter the S3 key (path) for the file:',
          initial: path.basename(filePath),
        },
      ];

      const answers = await prompts(questions);
      const { key } = answers;

      await uploadFile(filePath, key, bucketName, config);

      console.log(`File uploaded successfully to s3://${bucketName}/${key}`);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  });
