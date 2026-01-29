import type { File } from '@secrets-vault/shared/api/files';
import { FileAlreadyExistsError, FileNotFoundError } from '../file-errors.js';
import type { FileRepo } from '../file-repo.js';

export class MemoryFileRepo implements FileRepo {
  private files: Map<string, File & { userId: string }> = new Map();
  private fileNameIndex: Map<string, string> = new Map(); // userId:name -> fileId
  private shareLinks: Map<string, { fileId: string; code: string }> = new Map();

  async getUserFiles(userId: string): Promise<File[]> {
    const userFiles = Array.from(this.files.values()).filter((file) => file.userId === userId);
    return userFiles.map(({ userId: _, ...file }) => file).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async addFile(userId: string, name: string, content: string): Promise<File> {
    const nameKey = `${userId}:${name}`;
    if (this.fileNameIndex.has(nameKey)) {
      throw new FileAlreadyExistsError(name);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const file: File & { userId: string } = {
      id,
      userId,
      name,
      content,
      createdAt: now,
      updatedAt: now,
    };

    this.files.set(id, file);
    this.fileNameIndex.set(nameKey, id);
    return { id, name, content, createdAt: now, updatedAt: now };
  }

  async deleteFile(userId: string, id: string): Promise<File> {
    const file = this.files.get(id);
    if (!file || file.userId !== userId) {
      throw new FileNotFoundError(id);
    }

    this.files.delete(id);
    this.fileNameIndex.delete(`${userId}:${file.name}`);
    const { userId: _, ...result } = file;
    return result;
  }

  async getFile(userId: string, id: string): Promise<File> {
    const file = this.files.get(id);
    if (!file || file.userId !== userId) {
      throw new FileNotFoundError(id);
    }
    const { userId: _, ...result } = file;
    return result;
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

    const { userId: _, ...result } = file;
    return result;
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
