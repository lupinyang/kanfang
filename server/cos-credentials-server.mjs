import http from 'node:http';
import STS from 'qcloud-cos-sts';

const port = Number(process.env.COS_CREDENTIAL_PORT || 8787);
const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = process.env.COS_BUCKET || 'kanfang-1377314373';
const region = process.env.COS_REGION;
const allowPrefix = process.env.COS_ALLOW_PREFIX || 'property-images/*';

const sendJson = (response, status, data) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
};

const getCredentials = () =>
  new Promise((resolve, reject) => {
    if (!secretId || !secretKey || !region) {
      reject(new Error('Missing COS_SECRET_ID, COS_SECRET_KEY, or COS_REGION'));
      return;
    }

    STS.getCredential(
      {
        secretId,
        secretKey,
        durationSeconds: 1800,
        bucket,
        region,
        allowPrefix,
        allowActions: [
          'name/cos:PutObject',
          'name/cos:PostObject',
          'name/cos:InitiateMultipartUpload',
          'name/cos:ListMultipartUploads',
          'name/cos:ListParts',
          'name/cos:UploadPart',
          'name/cos:CompleteMultipartUpload',
        ],
      },
      (error, credentials) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(credentials);
      },
    );
  });

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' || request.url?.split('?')[0] !== '/api/cos-credentials') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  try {
    const credentials = await getCredentials();
    sendJson(response, 200, credentials);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: 'Failed to create COS credentials' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`COS credential server listening on http://127.0.0.1:${port}`);
});
