import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../../app.js';
import { mockAuthenticated, mockUnauthenticated, TEST_CONFIG, TEST_USER_ID } from '../../../config/testing.js';
import { encrypt } from '../../../lib/encryption.js';
import { HealthCheckMemoryRepo } from '../../health/repositories/health-check-memory-repo.js';
import { MemoryFileRepo } from '../repositories/memory-file-repo.js';

function createTestApp(fileRepo = new MemoryFileRepo()) {
  return createApp({
    enableLogging: false,
    apiDependencies: {
      healthRepository: new HealthCheckMemoryRepo(),
      fileRepository: fileRepo,
    },
  });
}

function encryptContent(content: string): string {
  return encrypt(content, TEST_CONFIG.encryption.key);
}

describe('FileController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/files/', () => {
    it('should return 200 with empty files array when user has no files', async () => {
      mockAuthenticated();
      const app = createTestApp();

      const response = await request(app).get('/api/v1/files/').expect(200);

      expect(response.body).toMatchObject({
        data: {
          files: [],
        },
      });
    });

    it('should return 200 with user files', async () => {
      mockAuthenticated();
      const fileRepo = new MemoryFileRepo();
      await fileRepo.addFile(TEST_USER_ID, 'test.txt', encryptContent('secret'));
      const app = createTestApp(fileRepo);

      const response = await request(app).get('/api/v1/files/').expect(200);

      expect(response.body.data.files).toHaveLength(1);
      expect(response.body.data.files[0]).toMatchObject({
        id: expect.any(String),
        name: 'test.txt',
        content: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 401 when not authenticated', async () => {
      mockUnauthenticated();
      const app = createTestApp();

      await request(app).get('/api/v1/files/').expect(401);
    });
  });

  describe('POST /api/v1/files/', () => {
    it('should return 201 with file id when adding a file', async () => {
      mockAuthenticated();
      const app = createTestApp();

      const response = await request(app)
        .post('/api/v1/files/')
        .send({ name: 'secret.txt', content: 'my secret content' })
        .expect(201);

      expect(response.body).toMatchObject({
        data: {
          id: expect.any(String),
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    it('should return 409 when file already exists', async () => {
      mockAuthenticated();
      const fileRepo = new MemoryFileRepo();
      await fileRepo.addFile(TEST_USER_ID, 'existing.txt', 'content');
      const app = createTestApp(fileRepo);

      const response = await request(app)
        .post('/api/v1/files/')
        .send({ name: 'existing.txt', content: 'new content' })
        .expect(409);

      expect(response.body).toMatchObject({
        error: {
          code: 'FILE_ALREADY_EXISTS',
          message: expect.stringContaining('existing.txt'),
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    it('should return 400 when name is missing', async () => {
      mockAuthenticated();
      const app = createTestApp();

      await request(app).post('/api/v1/files/').send({ content: 'content' }).expect(400);
    });

    it('should return 400 when content is missing', async () => {
      mockAuthenticated();
      const app = createTestApp();

      await request(app).post('/api/v1/files/').send({ name: 'test.txt' }).expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      mockUnauthenticated();
      const app = createTestApp();

      await request(app).post('/api/v1/files/').send({ name: 'test.txt', content: 'content' }).expect(401);
    });
  });

  describe('DELETE /api/v1/files/:id', () => {
    it('should return 200 with deleted file info', async () => {
      mockAuthenticated();
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'delete-me.txt', 'content');
      const app = createTestApp(fileRepo);

      const response = await request(app).delete(`/api/v1/files/${file.id}`).expect(200);

      expect(response.body).toMatchObject({
        data: {
          id: file.id,
          name: 'delete-me.txt',
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    it('should return 404 when file not found', async () => {
      mockAuthenticated();
      const app = createTestApp();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).delete(`/api/v1/files/${nonExistentId}`).expect(404);

      expect(response.body).toMatchObject({
        error: {
          code: 'FILE_NOT_FOUND',
        },
        meta: {
          requestId: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    it('should return 400 when id is not a valid UUID', async () => {
      mockAuthenticated();
      const app = createTestApp();

      await request(app).delete('/api/v1/files/invalid-id').expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      mockUnauthenticated();
      const app = createTestApp();

      await request(app).delete('/api/v1/files/00000000-0000-0000-0000-000000000000').expect(401);
    });
  });

  describe('GET /api/v1/files/:id', () => {
    it('should return 200 with file when found', async () => {
      mockAuthenticated();
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'my-file.txt', encryptContent('secret'));
      const app = createTestApp(fileRepo);

      const response = await request(app).get(`/api/v1/files/${file.id}`).expect(200);

      expect(response.body).toMatchObject({
        data: {
          file: {
            id: file.id,
            name: 'my-file.txt',
            content: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      });
    });

    it('should return 404 when file not found', async () => {
      mockAuthenticated();
      const app = createTestApp();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).get(`/api/v1/files/${nonExistentId}`).expect(404);

      expect(response.body).toMatchObject({
        error: {
          code: 'FILE_NOT_FOUND',
        },
      });
    });

    it('should return 400 when id is not a valid UUID', async () => {
      mockAuthenticated();
      const app = createTestApp();

      await request(app).get('/api/v1/files/not-a-uuid').expect(400);
    });

    it('should return 401 when not authenticated', async () => {
      mockUnauthenticated();
      const app = createTestApp();

      await request(app).get('/api/v1/files/00000000-0000-0000-0000-000000000000').expect(401);
    });
  });

  describe('POST /api/v1/files/:id/share', () => {
    it('should return 200 with share code', async () => {
      mockAuthenticated();
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'share-me.txt', 'content');
      const app = createTestApp(fileRepo);

      const response = await request(app).post(`/api/v1/files/${file.id}/share`).expect(200);

      expect(response.body).toMatchObject({
        data: {
          id: file.id,
          code: expect.any(String),
        },
      });
    });

    it('should return 404 when file not found', async () => {
      mockAuthenticated();
      const app = createTestApp();
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).post(`/api/v1/files/${nonExistentId}/share`).expect(404);

      expect(response.body).toMatchObject({
        error: {
          code: 'FILE_NOT_FOUND',
        },
      });
    });

    it('should return 401 when not authenticated', async () => {
      mockUnauthenticated();
      const app = createTestApp();

      await request(app).post('/api/v1/files/00000000-0000-0000-0000-000000000000/share').expect(401);
    });
  });

  describe('GET /api/v1/files/:id/share', () => {
    it('should return 200 with file when valid share link', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'shared.txt', encryptContent('shared'));
      const code = await fileRepo.generateShareLink(file.id, 'share-code-123');

      mockUnauthenticated();
      const app = createTestApp(fileRepo);

      const response = await request(app).get(`/api/v1/files/${file.id}/share?code=${code}`).expect(200);

      expect(response.body).toMatchObject({
        data: {
          file: {
            id: file.id,
            name: 'shared.txt',
            content: expect.any(String),
          },
        },
      });
    });

    it('should return 404 when share code is invalid', async () => {
      const fileRepo = new MemoryFileRepo();
      const file = await fileRepo.addFile(TEST_USER_ID, 'shared.txt', 'content');
      await fileRepo.generateShareLink(file.id, 'correct-code');
      const app = createTestApp(fileRepo);

      const response = await request(app).get(`/api/v1/files/${file.id}/share?code=wrong-code`).expect(404);

      expect(response.body).toMatchObject({
        error: {
          code: 'FILE_NOT_FOUND',
        },
      });
    });

    it('should return 400 when code query param is missing', async () => {
      const app = createTestApp();

      await request(app).get('/api/v1/files/00000000-0000-0000-0000-000000000000/share').expect(400);
    });
  });
});
