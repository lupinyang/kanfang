import COS from 'cos-js-sdk-v5';

const bucket = import.meta.env.VITE_COS_BUCKET as string | undefined;
const region = import.meta.env.VITE_COS_REGION as string | undefined;
const credentialPath = import.meta.env.VITE_COS_CREDENTIAL_PATH || '/api/cos-credentials';

interface CosCredentialResponse {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  startTime: number;
  expiredTime: number;
}

const cos = new COS({
  getAuthorization: async (_options, callback) => {
    const response = await fetch(credentialPath);

    if (!response.ok) {
      throw new Error('无法获取图片上传凭证');
    }

    const data = (await response.json()) as CosCredentialResponse;

    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      StartTime: data.startTime,
      ExpiredTime: data.expiredTime,
    });
  },
});

const getPublicUrl = (key: string) => {
  if (!bucket || !region) {
    throw new Error('缺少 COS Bucket 或 Region 配置');
  }

  const encodedKey = key
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  return `https://${bucket}.cos.${region}.myqcloud.com/${encodedKey}`;
};

const getObjectKey = (file: File) => {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const safeExt = (ext || 'jpg').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `property-images/${new Date().toISOString().slice(0, 10)}/${id}.${safeExt}`;
};

export const uploadPropertyImage = async (file: File): Promise<string> => {
  if (!bucket || !region) {
    throw new Error('缺少 COS Bucket 或 Region 配置');
  }

  const key = getObjectKey(file);

  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: file,
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });

  return getPublicUrl(key);
};

export const uploadPropertyImages = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map(uploadPropertyImage));
};
