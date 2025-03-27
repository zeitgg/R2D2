import { S3 } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { startSpinner, stopSpinner } from './spinner';
import { Upload } from "@aws-sdk/lib-storage";

interface Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  accountId?: string;
}

export async function uploadFile(
  filePath: string,
  key: string,
  bucketName: string,
  config: Config
): Promise<void> {
  const { accessKeyId, secretAccessKey, region, accountId } = config;

  const s3 = new S3({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(accountId && { // Conditionally add endpoint for R2
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    }),
  });

  const fileStream = fs.createReadStream(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  const fileSize = fs.statSync(filePath).size;

  startSpinner(`Uploading ${key}...`);

  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
        ContentLength: fileSize
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 10 * 1024 * 1024, // optional target part size
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    upload.on("httpUploadProgress", (progress) => {
      if (progress.total) {
        const percentage = progress.loaded !== undefined && progress.total
          ? Math.round((progress.loaded / progress.total) * 100)
          : 0;
        startSpinner(`Uploading ${key}... ${percentage}%`);
      }
    });

    await upload.done();
    stopSpinner('File uploaded successfully.');
  } catch (error) {
    stopSpinner('Upload failed.');
    throw error;
  }
}
