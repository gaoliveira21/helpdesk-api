import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { App } from 'supertest/types';

describe('Auth', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth', () => {
    it.each(['invalid-email', 'user@.com', 'user.com', '@example.com'])(
      'should return a BadRequest error if email is invalid',
      async (email) => {
        await request(app.getHttpServer())
          .post('/auth')
          .send({ email, password: 'validPassword123' })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it.each(['', '123', 'short'])(
      'should return a BadRequest error if password is invalid',
      async (password) => {
        await request(app.getHttpServer())
          .post('/auth')
          .send({ email: 'valid@example.com', password })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );
  });
});
