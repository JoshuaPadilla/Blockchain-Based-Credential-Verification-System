import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const ALGORITHM = 'aes-256-ctr';

const getKey = async (): Promise<Buffer> => {
  // If you don't use a default, ensure MASTER_KEY is set
  const password = process.env.ENCRYPTION_MASTER_KEY;
  if (!password) {
    throw new Error('ENCRYPTION_MASTER_KEY is not set in .env file');
  }
  return (await promisify(scrypt)(password!, 'salt', 32)) as Buffer;
};

export const encrypt = async (text: string): Promise<string> => {
  const iv = randomBytes(16);
  const key = await getKey();

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = async (hash: string): Promise<string> => {
  const [ivPart, contentPart] = hash.split(':');

  if (!ivPart || !contentPart) {
    throw new Error('Invalid hash format. Cannot decrypt.');
  }

  const iv = Buffer.from(ivPart, 'hex');
  const content = Buffer.from(contentPart, 'hex');
  const key = await getKey();

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

  return decrypted.toString();
};
