# R2D2

R2D2 is a command-line interface tool designed to simplify and automate file uploads to S3 or Cloudflare R2 buckets.

## Features

- **File Uploads**: Easily upload files to S3 or R2 buckets.
- **Configuration Management**: Save and manage AWS/R2 credentials and bucket settings.
- **Progress Tracking**: Real-time upload progress with a spinner.
- **Cross-Platform**: Works on Windows, macOS, and Linux.
- **Extensible**: Built with TypeScript for easy customization.

## Installation

To install R2D2, use the following command:

```bash
(npm/bun/pnpm/yarn) install -g @zeitgg/r2d2
```

Ensure you have [Node.js](https://nodejs.org/) installed before proceeding.

## Usage

Once installed, you can start using R2D2 by typing:

```bash
r2d2 [command] [options]
```

For a list of available commands, run:

```bash
r2d2 --help
```

## Commands

### Configure
Set up your AWS or R2 credentials and bucket settings.

```bash
r2d2 configure
```

### Upload
Upload a file to the configured bucket.

```bash
r2d2 upload <filePath>
```

Example:

```bash
r2d2 upload ./example.txt
```

## Configuration

The `configure` command will prompt you to enter:

- AWS Access Key ID
- AWS Secret Access Key
- Region
- Bucket Name
- (Optional) R2 Account ID

The configuration is saved locally in `~/.r2d2/config.json`.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you'd like to change.

## License

This project is licensed under the [ISC License](LICENSE).

## Feedback

If you encounter any issues or have suggestions, feel free to open an issue on the [GitHub repository](https://github.com/zeitgg/r2d2).

---
Simplify your cloud storage workflows with R2D2. May the automation be with you!