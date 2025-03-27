import { Command } from 'commander';
import prompts from 'prompts';
import kleur from 'kleur';
import { setConfig } from '../utils/config';
import type { Config } from '../utils/config';

export const configureCommand = new Command('configure')
  .description('Configure AWS/R2 credentials and bucket settings')
  .action(async () => {
    console.log(kleur.bold().cyan('Welcome to the R2/S3 Uploader Configuration!'));
    console.log(
      kleur.gray('Please provide the following information to configure your AWS or R2 account:')
    );

    const questions: prompts.PromptObject<string>[] = [
      {
        type: 'text',
        name: 'accessKeyId',
        message: kleur.yellow('AWS Access Key ID:'),
        validate: (value) =>
          value ? true : kleur.red('Access Key ID cannot be empty.'),
      },
      {
        type: 'password',
        name: 'secretAccessKey',
        message: kleur.yellow('AWS Secret Access Key:'),
        validate: (value) =>
          value ? true : kleur.red('Secret Access Key cannot be empty.'),
      },
      {
        type: 'text',
        name: 'region',
        message: kleur.yellow('Region (auto, or specify):'),
        initial: 'auto',
        validate: (value) =>
          value ? true : kleur.red('Region cannot be empty.'),
        hint: 'Enter "auto" to let the CLI attempt to determine the region automatically',
      },
      {
        type: 'text',
        name: 'bucketName',
        message: kleur.yellow('Bucket Name:'),
        validate: (value) =>
          value ? true : kleur.red('Bucket Name cannot be empty.'),
      },
      {
        type: 'text',
        name: 'accountId',
        message: kleur.yellow('R2 Account ID (optional, only if using R2):'),
        hint:
          'Only required if using Cloudflare R2. Leave blank if not applicable.',
      },
    ];

    try {
      const answers = await prompts(questions, {
        onCancel: () => {
          console.log(kleur.red('Configuration cancelled.'));
          process.exit(0); // Exit gracefully
        },
      });

      const config: Config = {
        accessKeyId: answers.accessKeyId,
        secretAccessKey: answers.secretAccessKey,
        region: answers.region,
        bucketName: answers.bucketName,
        accountId: answers.accountId || undefined,
      };
      setConfig(config);

      console.log(kleur.green().bold('Configuration saved successfully!'));
      console.log(
        kleur.gray('You can now use the `upload` command to upload files.')
      );
    } catch (error: any) {
      console.error(kleur.red().bold('Error during configuration:'), error.message || error); // Log error message
    }
  });
