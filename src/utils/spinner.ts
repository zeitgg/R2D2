import ora from "ora";

let spinner = ora();

export function startSpinner(text: string): void {
  if (!spinner.isSpinning) {
    spinner = ora(text).start();
  } else {
    spinner.text = text;
  }
}

export function stopSpinner(text: string): void {
  spinner.succeed(text);
}

export function failSpinner(text: string): void {
  spinner.fail(text);
}
