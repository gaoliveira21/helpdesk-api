import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from 'src/modules/app.module';

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

    it('should return 400 if credentials are invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'nonexistent@example.com',
          password: 'validPassword123',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid credentials');
        });
    });

    it('should return 201 and set cookies if credentials are valid', async () => {
      await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: process.env.DEFAULT_ADMIN_PASSWORD,
        })
        .expect(201)
        .expect(({ body, headers }) => {
          console.log(headers['set-cookie']);
          expect(body.accessTokenExpiresAt).toBeDefined();
          expect(body.refreshTokenExpiresAt).toBeDefined();
          expect(headers['set-cookie']).toMatchObject([
            expect.stringMatching(
              /accessToken=.+; Path=\/; Expires=.+; HttpOnly; SameSite=None/,
            ),
            expect.stringMatching(
              /refreshToken=.+; Path=\/auth\/refresh-token; Expires=.+; HttpOnly; SameSite=None/,
            ),
          ]);
        });
    });
  });
});
