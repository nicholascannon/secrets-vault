import type { File } from '@secrets-vault/shared/api/files';
import { FileAlreadyExistsError, FileNotFoundError } from '../file-errors.js';
import type { FileRepo } from '../file-repo.js';

export class MemoryFileRepo implements FileRepo {
  private files: Map<string, File> = new Map();
  private shareLinks: Map<string, { fileId: string; code: string }> = new Map();

  async getUserFiles(userId: string): Promise<File[]> {
    const userFiles = Array.from(this.files.values()).filter((file) => file.id.startsWith(`${userId}:`));
    return userFiles.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async addFile(userId: string, name: string, content: string): Promise<File> {
    const id = `${userId}:${name}`;
    if (this.files.has(id)) {
      throw new FileAlreadyExistsError(name);
    }

    const now = new Date().toISOString();
    const file: File = {
      id,
      name,
      content,
      createdAt: now,
      updatedAt: now,
    };

    this.files.set(id, file);
    return file;
  }

  async deleteFile(userId: string, id: string): Promise<File> {
    const file = this.files.get(id);
    if (!file || !id.startsWith(`${userId}:`)) {
      throw new FileNotFoundError(id);
    }

    this.files.delete(id);
    return file;
  }

  async getFile(userId: string, id: string): Promise<File> {
    const file = this.files.get(id);
    if (!file || !id.startsWith(`${userId}:`)) {
      throw new FileNotFoundError(id);
    }
    return file;
  }

  async getFileByShareLink(id: string, code: string): Promise<File> {
    const shareLink = this.shareLinks.get(id);
    if (!shareLink || shareLink.code !== code) {
      throw new FileNotFoundError(code);
    }

    const file = this.files.get(shareLink.fileId);
    if (!file) {
      throw new FileNotFoundError(code);
    }

    return file;
  }

  async generateShareLink(fileId: string, code: string): Promise<string> {
    const existing = this.shareLinks.get(fileId);
    if (existing) {
      return existing.code;
    }

    this.shareLinks.set(fileId, { fileId, code });
    return code;
  }
}
