import type { File } from '@secrets-vault/shared/api/files';
import { decrypt, encrypt } from '../../lib/encryption.js';
import type { FileRepo } from './file-repo.js';

export class FileService {
  constructor(
    private readonly fileRepo: FileRepo,
    private readonly encryptionKey: Buffer
  ) {}

  async getUserFiles(userId: string): Promise<File[]> {
    const files = await this.fileRepo.getUserFiles(userId);
    return files.map((file) => ({
      ...file,
      content: decrypt(file.content, this.encryptionKey),
    }));
  }

  async addFile(userId: string, name: string, content: string): Promise<File> {
    const encryptedContent = encrypt(content, this.encryptionKey);
    return this.fileRepo.addFile(userId, name, encryptedContent);
  }

  async deleteFile(userId: string, id: string): Promise<File> {
    return this.fileRepo.deleteFile(userId, id);
  }

  async getFile(userId: string, id: string): Promise<File> {
    const file = await this.fileRepo.getFile(userId, id);
    return {
      ...file,
      content: decrypt(file.content, this.encryptionKey),
    };
  }

  async getFileByShareLink(id: string, code: string): Promise<File> {
    const file = await this.fileRepo.getFileByShareLink(id, code);
    return {
      ...file,
      content: decrypt(file.content, this.encryptionKey),
    };
  }

  async generateShareLink(userId: string, id: string): Promise<string> {
    // validates the user owns this file
    const file = await this.fileRepo.getFile(userId, id);

    const code = await this.fileRepo.generateShareLink(file.id, crypto.randomUUID());

    return code;
  }
}
