import type { File } from '@secrets-vault/shared/api/files';
import type { FileRepo } from './file-repo.js';

export class FileService {
  constructor(private readonly fileRepo: FileRepo) {}

  async getUserFiles(userId: string): Promise<File[]> {
    return this.fileRepo.getUserFiles(userId);
  }

  async addFile(userId: string, name: string, content: string): Promise<File> {
    return this.fileRepo.addFile(userId, name, content);
  }

  async deleteFile(userId: string, id: string): Promise<File> {
    return this.fileRepo.deleteFile(userId, id);
  }
}
