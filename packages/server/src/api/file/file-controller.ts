import type {
  AddFileResponse,
  DeleteFileResponse,
  FileAlreadyExistsResponse,
  FileNotFoundResponse,
  GenerateShareLinkResponse,
  GetFileResponse,
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
    this.router.get('/:id', requiresAuth, this.getFile);
    this.router.post('/:id/share', requiresAuth, this.generateShareLink);
    this.router.get('/:id/share', this.getFileByShareLink);
    this.router.use(this.errorHandler);
  }

  private getUserFiles = async (req: Request, res: Response) => {
    const userId = getUserId(req);

    const files = await this.fileService.getUserFiles(userId);

    return res.status(200).json<GetUserFilesResponse>({
      data: {
        files,
      },
    });
  };

  private addFileSchema = z.object({
    name: z.string().nonempty(),
    content: z.string().nonempty(),
  });

  private addFile = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { name, content } = this.addFileSchema.parse(req.body);

    const file = await this.fileService.addFile(userId, name, content);

    return res.status(201).json<AddFileResponse>({
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

  private getFileSchema = z.object({
    id: z.uuid(),
  });

  private getFile = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = this.getFileSchema.parse(req.params);

    const file = await this.fileService.getFile(userId, id);

    return res.status(200).json<GetFileResponse>({
      data: {
        file,
      },
    });
  };

  private generateShareLinkSchema = z.object({
    id: z.uuid(),
  });

  private generateShareLink = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = this.generateShareLinkSchema.parse(req.params);

    const code = await this.fileService.generateShareLink(userId, id);

    return res.status(200).json<GenerateShareLinkResponse>({
      data: {
        id,
        code,
      },
    });
  };

  private getFileByShareLinkSchema = z.object({
    id: z.uuid(),
    code: z.string().nonempty(),
  });

  private getFileByShareLink = async (req: Request, res: Response) => {
    const { id, code } = this.getFileByShareLinkSchema.parse({
      ...req.params,
      ...req.query,
    });

    const file = await this.fileService.getFileByShareLink(id, code);

    return res.status(200).json<GetFileResponse>({
      data: {
        file,
      },
    });
  };

  private errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof FileAlreadyExistsError) {
      return res.status(409).json<FileAlreadyExistsResponse>({
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
