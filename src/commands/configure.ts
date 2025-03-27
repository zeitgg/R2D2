import { Command } from "commander";
import prompts from "prompts";
import { setConfig } from "../utils/config";

export const configureCommand = new Command("configure")
  .description("Configure AWS credentials and bucket settings")
  .action(async () => {
    const questions: prompts.PromptObject<string>[] = [
      {
        type: "text",
        name: "accessKeyId",
        message: "AWS Access Key ID:",
      },
      {
        type: "password",
        name: "secretAccessKey",
        message: "AWS Secret Access Key:",
      },
      {
        type: "text",
        name: "region",
        message: "Region (auto):",
        initial: "auto", // Use 'initial' instead of 'default'
      },
      {
        type: "text",
        name: "bucketName",
        message: "Bucket Name:",
      },
    ];

    try {
      const answers = await prompts(questions);
      setConfig({
        accessKeyId: answers.accessKeyId,
        secretAccessKey: answers.secretAccessKey,
        region: answers.region,
        bucketName: answers.bucketName,
      });
      console.log("Configuration saved.");
    } catch (error) {
      console.error("Prompt cancelled or error:", error);
    }
  });
