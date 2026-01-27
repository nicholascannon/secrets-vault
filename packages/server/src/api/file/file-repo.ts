import type { File } from '@secrets-vault/shared/api/files';

export interface FileRepo {
  getUserFiles(userId: string): Promise<File[]>;
  addFile(userId: string, name: string, content: string): Promise<File>;
  deleteFile(userId: string, id: string): Promise<File>;
  getFile(userId: string, id: string): Promise<File>;
}
