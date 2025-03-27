import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.r2-s3-uploader');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  accountId?: string; // Add accountId (optional)
}

export function getConfig(): Config | null {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return null;
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    return null;
  }
}

export function setConfig(config: Config): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error writing config:', error);
  }
}
