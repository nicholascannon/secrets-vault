import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_CONFIG } from '../../../config/testing.js';
import * as encryptionModule from '../../../lib/encryption.js';
import { FileAlreadyExistsError, FileNotFoundError } from '../file-errors.js';
import { FileService } from '../file-service.js';
import { MemoryFileRepo } from '../repositories/memory-file-repo.js';

const TEST_USER_ID = 'user_test123';

function createService(fileRepo = new MemoryFileRepo()) {
  return {
    service: new FileService(fileRepo, TEST_CONFIG.encryption.key),
    fileRepo,
  };
}

describe('FileService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('addFile', () => {
    it('should call repo.addFile with userId, name, and encrypted content', async () => {
      const fileRepo = new MemoryFileRepo();
      const addFileSpy = vi.spyOn(fileRepo, 'addFile');
      const encryptSpy = vi.spyOn(encryptionModule, 'encrypt');
      const { service } = createService(fileRepo);
      const plainContent = 'my secret password';

      await service.addFile(TEST_USER_ID, 'secrets.txt', plainContent);

      expect(encryptSpy).toHaveBeenCalledOnce();
      expect(encryptSpy).toHaveBeenCalledWith(plainContent, TEST_CONFIG.encryption.key);

      expect(addFileSpy).toHaveBeenCalledOnce();
      expect(addFileSpy).toHaveBeenCalledWith(TEST_USER_ID, 'secrets.txt', expect.any(String));

      // Verify the content passed to repo is encrypted (not plain)
      const passedContent = addFileSpy.mock.calls[0]?.[2];
      expect(passedContent).not.toBe(plainContent);
    });

    it('should return file id that can be used to retrieve the file', async () => {
      const fileRepo = new MemoryFileRepo();
      const { service } = createService(fileRepo);

      const fileId = await service.addFile(TEST_USER_ID, 'test.txt', 'my secret');

      expect(typeof fileId).toBe('string');
      expect(fileId.length).toBeGreaterThan(0);

      // Verify the returned ID matches what's in the repo
      const file = await fileRepo.getFile(TEST_USER_ID, fileId);
      expect(file.name).toBe('test.txt');
    });

    it('should propagate FileAlreadyExistsError from repo', async () => {
      const { service } = createService();
      await service.addFile(TEST_USER_ID, 'duplicate.txt', 'first content');

      await expect(service.addFile(TEST_USER_ID, 'duplicate.txt', 'second content')).rejects.toThrow(
        FileAlreadyExistsError
      );
    });
  });

  describe('getUserFiles', () => {
    it('should call repo.getUserFiles with correct userId', async () => {
      const fileRepo = new MemoryFileRepo();
      const getUserFilesSpy = vi.spyOn(fileRepo, 'getUserFiles');
      const { service } = createService(fileRepo);

      await service.getUserFiles(TEST_USER_ID);

      expect(getUserFilesSpy).toHaveBeenCalledOnce();
      expect(getUserFilesSpy).toHaveBeenCalledWith(TEST_USER_ID);
    });

    it('should decrypt each file content returned from repo', async () => {
      const decryptSpy = vi.spyOn(encryptionModule, 'decrypt');
      const fileRepo = new MemoryFileRepo();
      const encrypted1 = encryptionModule.encrypt('secret1', TEST_CONFIG.encryption.key);
      const encrypted2 = encryptionModule.encrypt('secret2', TEST_CONFIG.encryption.key);
      await fileRepo.addFile(TEST_USER_ID, 'file1.txt', encrypted1);
      await fileRepo.addFile(TEST_USER_ID, 'file2.txt', encrypted2);

      const { service } = createService(fileRepo);
      const files = await service.getUserFiles(TEST_USER_ID);

      expect(decryptSpy).toHaveBeenCalledTimes(2);
      expect(decryptSpy).toHaveBeenCalledWith(encrypted1, TEST_CONFIG.encryption.key);
      expect(decryptSpy).toHaveBeenCalledWith(encrypted2, TEST_CONFIG.encryption.key);

      // Verify actual decryption worked
      expect(files.map((f) => f.content).sort()).toEqual(['secret1', 'secret2']);
    });

    it('should return empty array when repo returns no files', async () => {
      const { service } = createService();

      const files = await service.getUserFiles(TEST_USER_ID);

      expect(files).toEqual([]);
    });
  });

  describe('getFile', () => {
    it('should call repo.getFile with correct userId and fileId', async () => {
      const fileRepo = new MemoryFileRepo();
      const encryptedContent = encryptionModule.encrypt('secret', TEST_CONFIG.encryption.key);
      const storedFile = await fileRepo.addFile(TEST_USER_ID, 'test.txt', encryptedContent);
      const getFileSpy = vi.spyOn(fileRepo, 'getFile');

      const { service } = createService(fileRepo);
      await service.getFile(TEST_USER_ID, storedFile.id);

      expect(getFileSpy).toHaveBeenCalledOnce();
      expect(getFileSpy).toHaveBeenCalledWith(TEST_USER_ID, storedFile.id);
    });

    it('should decrypt file content returned from repo', async () => {
      const decryptSpy = vi.spyOn(encryptionModule, 'decrypt');
      const fileRepo = new MemoryFileRepo();
      const encryptedContent = encryptionModule.encrypt('single file secret', TEST_CONFIG.encryption.key);
      const storedFile = await fileRepo.addFile(TEST_USER_ID, 'single.txt', encryptedContent);

      const { service } = createService(fileRepo);
      const file = await service.getFile(TEST_USER_ID, storedFile.id);

      expect(decryptSpy).toHaveBeenCalledOnce();
      expect(decryptSpy).toHaveBeenCalledWith(encryptedContent, TEST_CONFIG.encryption.key);
      expect(file.content).toBe('single file secret');
    });

    it('should propagate FileNotFoundError from repo', async () => {
      const { service } = createService();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(service.getFile(TEST_USER_ID, nonExistentId)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('deleteFile', () => {
    it('should call repo.deleteFile with correct userId and fileId', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'to-delete.txt', 'content');
      const deleteFileSpy = vi.spyOn(fileRepo, 'deleteFile');

      const { service } = createService(fileRepo);
      await service.deleteFile(TEST_USER_ID, file.id);

      expect(deleteFileSpy).toHaveBeenCalledOnce();
      expect(deleteFileSpy).toHaveBeenCalledWith(TEST_USER_ID, file.id);
    });

    it('should return deleted file info from repo', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'to-delete.txt', 'content');

      const { service } = createService(fileRepo);
      const deleted = await service.deleteFile(TEST_USER_ID, file.id);

      expect(deleted.id).toBe(file.id);
      expect(deleted.name).toBe('to-delete.txt');
    });

    it('should propagate FileNotFoundError from repo', async () => {
      const { service } = createService();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(service.deleteFile(TEST_USER_ID, nonExistentId)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('getFileByShareLink', () => {
    it('should call repo.getFileByShareLink with correct id and code', async () => {
      const fileRepo = new MemoryFileRepo();
      const encryptedContent = encryptionModule.encrypt('shared secret', TEST_CONFIG.encryption.key);
      const file = await fileRepo.addFile(TEST_USER_ID, 'shared.txt', encryptedContent);
      const code = await fileRepo.generateShareLink(file.id, 'share-code-abc');
      const getFileByShareLinkSpy = vi.spyOn(fileRepo, 'getFileByShareLink');

      const { service } = createService(fileRepo);
      await service.getFileByShareLink(file.id, code);

      expect(getFileByShareLinkSpy).toHaveBeenCalledOnce();
      expect(getFileByShareLinkSpy).toHaveBeenCalledWith(file.id, code);
    });

    it('should decrypt file content returned from repo', async () => {
      const decryptSpy = vi.spyOn(encryptionModule, 'decrypt');
      const fileRepo = new MemoryFileRepo();
      const encryptedContent = encryptionModule.encrypt('shared secret', TEST_CONFIG.encryption.key);
      const file = await fileRepo.addFile(TEST_USER_ID, 'shared.txt', encryptedContent);
      const code = await fileRepo.generateShareLink(file.id, 'share-code-abc');

      const { service } = createService(fileRepo);
      const sharedFile = await service.getFileByShareLink(file.id, code);

      expect(decryptSpy).toHaveBeenCalledOnce();
      expect(decryptSpy).toHaveBeenCalledWith(encryptedContent, TEST_CONFIG.encryption.key);
      expect(sharedFile.content).toBe('shared secret');
    });

    it('should propagate FileNotFoundError when share code is invalid', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'shared.txt', 'content');
      await fileRepo.generateShareLink(file.id, 'correct-code');

      const { service } = createService(fileRepo);

      await expect(service.getFileByShareLink(file.id, 'wrong-code')).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('generateShareLink', () => {
    it('should call repo.getFile to validate ownership before generating link', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'my-file.txt', 'content');
      const getFileSpy = vi.spyOn(fileRepo, 'getFile');
      const generateShareLinkSpy = vi.spyOn(fileRepo, 'generateShareLink');

      const { service } = createService(fileRepo);
      await service.generateShareLink(TEST_USER_ID, file.id);

      // Verify ownership check happens first
      expect(getFileSpy).toHaveBeenCalledOnce();
      expect(getFileSpy).toHaveBeenCalledWith(TEST_USER_ID, file.id);

      // Then share link is generated
      expect(generateShareLinkSpy).toHaveBeenCalledOnce();
      expect(generateShareLinkSpy).toHaveBeenCalledWith(file.id, expect.any(String));
    });

    it('should return share code from repo', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'my-file.txt', 'content');

      const { service } = createService(fileRepo);
      const code = await service.generateShareLink(TEST_USER_ID, file.id);

      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBeGreaterThan(0);
    });

    it('should propagate FileNotFoundError when file does not exist', async () => {
      const { service } = createService();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(service.generateShareLink(TEST_USER_ID, nonExistentId)).rejects.toThrow(FileNotFoundError);
    });

    it('should not call generateShareLink if ownership check fails', async () => {
      const fileRepo = new MemoryFileRepo();
      const generateShareLinkSpy = vi.spyOn(fileRepo, 'generateShareLink');
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const { service } = createService(fileRepo);

      await expect(service.generateShareLink(TEST_USER_ID, nonExistentId)).rejects.toThrow(FileNotFoundError);
      expect(generateShareLinkSpy).not.toHaveBeenCalled();
    });
  });
});
