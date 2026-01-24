import type { ApiErrorResponse, ApiResponse } from '../types/api-response.js';

export type File = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AddFileResponse = ApiResponse<{ id: string }>;
export type GetUserFilesResponse = ApiResponse<{ files: Array<File> }>;

export type FileAlreadyExistsResponse = ApiErrorResponse<'FILE_ALREADY_EXISTS'>;

export type DeleteFileResponse = ApiResponse<{ id: string; name: string }>;

export type FileNotFoundResponse = ApiErrorResponse<'FILE_NOT_FOUND'>;
