import type { ApiResponse } from '../types/api-response.js';

export type File = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AddFileResponse = ApiResponse<{ id: string }, 'ADD_FILE_SUCCESS'>;
export type GetUserFilesResponse = ApiResponse<
  {
    files: Array<File>;
  },
  'GET_USER_FILES_SUCCESS'
>;

export type FileAlreadyExistsResponse = ApiResponse<never, 'FILE_ALREADY_EXISTS'>;

export type DeleteFileResponse = ApiResponse<{ id: string; name: string }, 'DELETE_FILE_SUCCESS'>;

export type FileNotFoundResponse = ApiResponse<never, 'FILE_NOT_FOUND'>;
