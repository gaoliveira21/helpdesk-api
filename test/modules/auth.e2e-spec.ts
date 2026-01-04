import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';

import { AppModule } from 'src/modules/app.module';

describe('Auth', () => {
  let app: INestApplication<App>;
  let agent: TestAgent;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());

    await app.init();
  });

  beforeEach(async () => {
    agent = request.agent(app.getHttpServer());

    const res = await agent.post('/auth/csrf-token');
    agent.set('x-csrf-token', res.body.csrfToken);
  });

  afterAll(async () => {
    await app.close();
  });
  describe('POST /auth', () => {
    it.each(['invalid-email', 'user@.com', 'user.com', '@example.com'])(
      'should return a BadRequest error if email is invalid (%s)',
      async (email) => {
        await agent
          .post('/auth')
          .send({ email, password: 'validPassword123' })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it.each(['', '123', 'short', '12345678901234567890123456'])(
      'should return a BadRequest error if password is invalid (%s)',
      async (password) => {
        await agent
          .post('/auth')
          .send({ email: 'valid@example.com', password })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it('should return 400 if credentials are invalid', async () => {
      await agent
        .post('/auth')
        .send({
          email: 'nonexistent@example.com',
          password: 'validPassword123',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid credentials');
          expect(body.type).toContain('InvalidCredentialsError');
        });
    });

    it('should return 201 and set cookies if credentials are valid', async () => {
      await agent
        .post('/auth')
        .send({
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: process.env.DEFAULT_ADMIN_PASSWORD,
        })
        .expect(201)
        .expect(({ body, headers }) => {
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

  describe('POST /auth/refresh-token', () => {
    it('should return 401 if refresh token is missing', async () => {
      const res = await request(app.getHttpServer()).post('/auth/csrf-token');

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('x-csrf-token', res.body.csrfToken as string)
        .set('Cookie', res.headers['set-cookie'])
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid refresh token');
        });
    });

    it('should return 401 if refresh token is invalid', async () => {
      const res = await request(app.getHttpServer()).post('/auth/csrf-token');

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('x-csrf-token', res.body.csrfToken as string)
        .set(
          'Cookie',
          res.headers['set-cookie'] + '; refreshToken=invalid-token',
        )
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid refresh token');
        });
    });

    it('should return 200 and set new cookies if refresh token is valid', async () => {
      await agent.post('/auth').send({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
      });

      await agent
        .post('/auth/refresh-token')
        .expect(200)
        .expect(({ body, headers }) => {
          expect(body.accessTokenExpiresAt).toBeDefined();
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

  describe('DELETE /auth/sign-out', () => {
    it('should clear authentication cookies on sign-out', async () => {
      await agent.post('/auth').send({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
      });

      await agent
        .delete('/auth/sign-out')
        .expect(204)
        .expect(({ headers }) => {
          expect(headers['set-cookie']).toMatchObject([
            'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
          ]);
        });
    });
  });

  describe('POST /auth/csrf-token', () => {
    it('should return 201 and set csrfToken cookie', async () => {
      await request(app.getHttpServer())
        .post('/auth/csrf-token')
        .expect(201)
        .expect(({ body, headers }) => {
          expect(body.csrfToken).toBeDefined();
          expect(headers['set-cookie']).toMatchObject([
            expect.stringMatching(/csrfToken=.+; Path=\/; SameSite=None/),
          ]);
        });
    });
  });
});
