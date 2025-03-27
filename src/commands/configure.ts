import { Command } from "commander";
import prompts from "prompts";
import kleur from "kleur";
import { setConfig } from "../utils/config";
import type { Config } from "../utils/config";

export const configureCommand = new Command("configure")
  .description("Configure AWS/R2 credentials and bucket settings")
  .action(async () => {
    console.log(kleur.bold().cyan("R2D2 CLI Configuration"));
    console.log(
      kleur.gray(
        "Please provide your AWS/R2 credentials. The bucket name will be prompted for each upload."
      )
    );
    console.log(); // Add empty line for better spacing

    const questions: prompts.PromptObject<string>[] = [
      {
        type: "text",
        name: "accessKeyId",
        message: kleur.yellow("AWS Access Key ID:"),
        validate: (value) =>
          value ? true : kleur.red("Access Key ID cannot be empty."),
      },
      {
        type: "password",
        name: "secretAccessKey",
        message: kleur.yellow("AWS Secret Access Key:"),
        validate: (value) =>
          value ? true : kleur.red("Secret Access Key cannot be empty."),
      },
      {
        type: "text",
        name: "region",
        message: kleur.yellow("Region (auto, or specify):"),
        initial: "auto",
        validate: (value) =>
          value ? true : kleur.red("Region cannot be empty."),
        hint: 'Enter "auto" to let the CLI attempt to determine the region automatically',
      },
      // Bucket name removed as it will be prompted for each upload
      {
        type: "text",
        name: "accountId",
        message: kleur.yellow("R2 Account ID (optional, only if using R2):"),
        hint: "Only required if using Cloudflare R2. Leave blank if not applicable.",
      },
    ];

    try {
      const answers = await prompts(questions, {
        onCancel: () => {
          console.log(kleur.red("Configuration cancelled."));
          process.exit(0); // Exit gracefully
        },
      });

      const config: Config = {
        accessKeyId: answers.accessKeyId,
        secretAccessKey: answers.secretAccessKey,
        region: answers.region,
        accountId: answers.accountId || undefined,
      };
      setConfig(config);

      console.log(kleur.green().bold("✓ Configuration saved successfully!"));
      console.log(
        kleur.gray(
          "You can now use the `upload` command to upload files to any bucket."
        )
      );
      console.log(
        kleur.gray(`Run ${kleur.bold("r2d2 upload <file>")} to upload a file.`)
      );
    } catch (error: any) {
      console.error(
        kleur.red().bold("Error during configuration:"),
        error.message || error
      ); // Log error message
    }
  });
