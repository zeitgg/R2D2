import { Command } from "commander";
import prompts from "prompts";
import kleur from "kleur";
import { uploadFile } from "../utils/uploader";
import { getConfig } from "../utils/config";
import path from "path";

export const uploadCommand = new Command("upload")
  .description("Upload a file to the configured S3/R2 bucket")
  .argument("<filePath>", "Path to the file to upload")
  .action(async (filePath) => {
    try {
      let config = getConfig();
      if (!config) {
        console.error("Configuration not found. Please run `configure` first.");
        return;
      }

      if (!config.accountId) {
        console.warn("R2 Account ID is not configured. Please provide it now.");
        const accountIdResponse = await prompts({
          type: "text",
          name: "accountId",
          message: "R2 Account ID:",
        });
        config = { ...config, accountId: accountIdResponse.accountId };
      }

      const questions: prompts.PromptObject<string>[] = [
        {
          type: "text",
          name: "bucketName",
          message: "Enter the bucket name:",
          validate: (value) => (value ? true : "Bucket name cannot be empty."),
        },
        {
          type: "text",
          name: "key",
          message: "Enter the S3 key (path) for the file:",
          initial: path.basename(filePath),
        },
      ];

      const answers = await prompts(questions);
      const { key, bucketName } = answers;

      await uploadFile(filePath, key, bucketName, config);

      console.log(
        kleur.bold().green(`✓ Success!`) +
          ` File uploaded to ${kleur.cyan(bucketName)}/${kleur.yellow(key)}`
      );
    } catch (error) {
      console.error(kleur.bold().red(`✗ Upload failed:`), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
