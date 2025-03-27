import { Command } from "commander";
import prompts from "prompts";
import kleur from "kleur";
import path from "path";
import { uploadFile } from "../utils/uploader";
import { getConfig } from "../utils/config";
import type { Config } from "../utils/config";

export const uploadCommand = new Command("upload")
  .description("Upload a file to the configured S3/R2 bucket")
  .allowUnknownOption() // Allow any arguments
  .action(async (...args) => {
    // Capture all arguments
    try {
      console.log(kleur.bold().cyan("Starting file upload..."));

      const config = getConfig();
      if (!config) {
        console.error(
          kleur.red(
            "Configuration not found. Please run `configure` first to set up your AWS/R2 credentials."
          )
        );
        return;
      }

      let { accountId, bucketName } = config;

      if (!accountId) {
        console.warn(
          kleur.yellow(
            "R2 Account ID is not configured. Please provide it now for R2 uploads."
          )
        );
        const accountIdResponse = await prompts({
          type: "text",
          name: "accountId",
          message: kleur.yellow("R2 Account ID:"),
          validate: (value) =>
            value ? true : kleur.red("Account ID cannot be empty for R2."),
        });
        if (!accountIdResponse.accountId) {
          console.error(
            kleur.red("Upload cancelled. Account ID is required for R2.")
          );
          return; // Exit if accountId is not provided.
        }
        accountId = accountIdResponse.accountId;
        config.accountId = accountId; // Update config object
      }

      // Extract file path from arguments
      const filePath = args[0];

      if (!filePath || typeof filePath !== "string") {
        console.error(kleur.red("File path not provided."));
        return;
      }

      // Basic quote removal (handle single or double quotes)
      let cleanedFilePath = filePath;
      if (cleanedFilePath.startsWith('"') && cleanedFilePath.endsWith('"')) {
        cleanedFilePath = cleanedFilePath.slice(1, -1);
      } else if (
        cleanedFilePath.startsWith("'") &&
        cleanedFilePath.endsWith("'")
      ) {
        cleanedFilePath = cleanedFilePath.slice(1, -1);
      }

      const questions: prompts.PromptObject<string>[] = [
        {
          type: "text",
          name: "key",
          message: kleur.yellow("Enter the S3 key (path) for the file:"),
          initial: path.basename(cleanedFilePath),
          validate: (value) =>
            value ? true : kleur.red("Key/path cannot be empty."),
        },
      ];

      const answers = await prompts(questions, {
        onCancel: () => {
          console.log(kleur.red("Upload cancelled."));
          process.exit(0); // Exit gracefully
        },
      });

      const { key } = answers;

      console.log(
        kleur.gray(
          `Uploading ${kleur.bold(cleanedFilePath)} as ${kleur.bold(
            bucketName
          )}/${kleur.bold(key)}...`
        )
      );
      await uploadFile(cleanedFilePath, key, bucketName, {
        ...config,
        accountId,
      }); // Pass the updated config

      console.log(
        kleur.green().bold(`File uploaded successfully as ${bucketName}/${key}`)
      );
    } catch (error: any) {
      console.error(kleur.red().bold("Upload failed:"), error.message || error);
    }
  });
