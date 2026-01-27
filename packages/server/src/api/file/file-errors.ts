export class FileAlreadyExistsError extends Error {
  constructor(public readonly fileName: string) {
    super(`File ${fileName} already exists`);
    this.name = 'FileAlreadyExistsError';
  }
}

export class FileNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`File with id or code: ${id} not found`);
    this.name = 'FileNotFoundError';
  }
}
