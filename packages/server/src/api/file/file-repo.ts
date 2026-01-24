import type { File } from '@secrets-vault/shared/api/files';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';
import { FileAlreadyExistsError, FileNotFoundError } from './file-errors.js';

export interface FileRepo {
  getUserFiles(userId: string): Promise<File[]>;
  addFile(userId: string, name: string, content: string): Promise<File>;
  deleteFile(userId: string, id: string): Promise<File>;
}

export class PgFileRepo implements FileRepo {
  constructor(private readonly db: PrismaClient) {}

  async getUserFiles(userId: string): Promise<File[]> {
    const files = await this.db.dotFile.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return files.map((file) => ({
      id: file.id,
      name: file.name,
      content: file.content,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
    }));
  }

  async addFile(userId: string, name: string, content: string): Promise<File> {
    try {
      const file = await this.db.dotFile.create({
        data: {
          userId,
          name,
          content,
        },
      });

      return {
        id: file.id,
        name: file.name,
        content: file.content,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new FileAlreadyExistsError(name);
      }
      throw error;
    }
  }

  async deleteFile(userId: string, id: string): Promise<File> {
    try {
      const file = await this.db.dotFile.delete({
        where: {
          id,
          userId,
        },
      });

      return {
        id: file.id,
        name: file.name,
        content: file.content,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      // Prisma throws a PrismaClientKnownRequestError with code 'P2025' if the record doesn't exist
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new FileNotFoundError(id);
      }
      throw error;
    }
  }
}
