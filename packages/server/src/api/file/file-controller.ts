import type {
  AddFileResponse,
  DeleteFileResponse,
  FileAlreadyExistsResponse,
  FileNotFoundResponse,
  GetUserFilesResponse,
} from '@secrets-vault/shared/api/files';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import type { Controller } from '../../lib/controller.js';
import { getUserId, requiresAuth } from '../../middleware/requires-auth.js';
import { FileAlreadyExistsError, FileNotFoundError } from './file-errors.js';
import type { FileService } from './file-service.js';

export class FileController implements Controller {
  public readonly router: Router;

  constructor(private readonly fileService: FileService) {
    this.router = Router();
    this.router.get('/', requiresAuth, this.getUserFiles);
    this.router.post('/', requiresAuth, this.addFile);
    this.router.delete('/:id', requiresAuth, this.deleteFile);
    this.router.use(this.errorHandler);
  }

  private getUserFiles = async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const files = await this.fileService.getUserFiles(userId);

    return res.status(200).json<GetUserFilesResponse>({
      success: true,
      data: {
        files,
      },
    });
  };

  private createFileSchema = z.object({
    name: z.string().nonempty(),
    content: z.string().nonempty(),
  });

  private addFile = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { name, content } = this.createFileSchema.parse(req.body);

    const file = await this.fileService.addFile(userId, name, content);

    return res.status(201).json<AddFileResponse>({
      success: true,
      data: {
        id: file.id,
      },
      meta: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
      },
    });
  };

  private deleteFileSchema = z.object({
    id: z.uuid(),
  });

  private deleteFile = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = this.deleteFileSchema.parse(req.params);

    const deletedFile = await this.fileService.deleteFile(userId, id);

    return res.status(200).json<DeleteFileResponse>({
      success: true,
      data: {
        id: deletedFile.id,
        name: deletedFile.name,
      },
      meta: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
      },
    });
  };

  private errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof FileAlreadyExistsError) {
      return res.status(409).json<FileAlreadyExistsResponse>({
        success: false,
        error: {
          code: 'FILE_ALREADY_EXISTS',
          message: error.message,
        },
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }
    if (error instanceof FileNotFoundError) {
      return res.status(404).json<FileNotFoundResponse>({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: error.message,
        },
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    next(error);
  };
}
