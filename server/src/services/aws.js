import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { CloudFrontSign } from '@aws-sdk/cloudfront-signer'

export function s3() {
  const region = process.env.AWS_REGION
  const credentials = { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
  return new S3Client({ region, credentials })
}

export async function uploadToS3(bucket, key, body, contentType) {
  const client = s3()
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  return client.send(cmd)
}

export async function presignS3Url(bucket, key, expiresIn = 3600) {
  const client = s3()
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, cmd, { expiresIn })
}

export function signCloudFrontUrl(url, keyPairId, privateKey, expireMillis) {
  const signer = new CloudFrontSign({ keyPairId, privateKey })
  return signer.getSignedUrl({ url, dateLessThan: new Date(Date.now() + expireMillis) })
}
