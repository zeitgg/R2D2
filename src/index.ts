#!/usr/bin/env node
import { Command } from "commander";
import { configureCommand } from "./commands/configure";
import { uploadCommand } from "./commands/upload";

const program = new Command();

program
  .name("r2d2")
  .description("A CLI tool to upload files to R2/S3 buckets")
  .version("1.0.0");

program.addCommand(configureCommand);
// Add alias for configure command
program
  .command("config")
  .description("Alias for configure command")
  .action(() => {
    configureCommand.parseAsync(process.argv);
  });
program.addCommand(uploadCommand);

program.parse(process.argv);
