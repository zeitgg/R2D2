import { Command } from 'commander';
import prompts from 'prompts';
import { setConfig } from '../utils/config';
import type { Config } from '../utils/config'

export const configureCommand = new Command('configure')
  .description('Configure AWS credentials and bucket settings')
  .action(async () => {
    const questions: prompts.PromptObject<string>[] = [
      {
        type: 'text',
        name: 'accessKeyId',
        message: 'AWS Access Key ID:',
      },
      {
        type: 'password',
        name: 'secretAccessKey',
        message: 'AWS Secret Access Key:',
      },
      {
        type: 'text',
        name: 'region',
        message: 'Region (auto):',
        initial: 'auto',
      },
      {
        type: 'text',
        name: 'bucketName',
        message: 'Bucket Name:',
      },
      {
        type: 'text',
        name: 'accountId',
        message: 'R2 Account ID (optional, only if using R2):',
      },
    ];

    try {
      const answers = await prompts(questions);
      const config: Config = {
        accessKeyId: answers.accessKeyId,
        secretAccessKey: answers.secretAccessKey,
        region: answers.region,
        bucketName: answers.bucketName,
        accountId: answers.accountId || undefined,
      };
      setConfig(config);
      console.log('Configuration saved.');
    } catch (error) {
      console.error('Prompt cancelled or error:', error);
    }
  });
