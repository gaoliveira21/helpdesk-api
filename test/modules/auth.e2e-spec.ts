import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';

import { AppModule } from 'src/modules/app.module';

type Routes = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
};

describe('Auth', () => {
  let app: INestApplication<App>;
  const authRoutes: Routes[] = [{ method: 'delete', path: '/auth/sign-out' }];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth', () => {
    it.each(['invalid-email', 'user@.com', 'user.com', '@example.com'])(
      'should return a BadRequest error if email is invalid (%s)',
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

    it.each(['', '123', 'short', '12345678901234567890123456'])(
      'should return a BadRequest error if password is invalid (%s)',
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
          expect(body.type).toContain('InvalidCredentialsError');
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
      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid refresh token');
        });
    });

    it('should return 401 if refresh token is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', ['refreshToken=invalid.token.here'])
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toContain('Invalid refresh token');
        });
    });

    it('should return 200 and set new cookies if refresh token is valid', async () => {
      const agent = request.agent(app.getHttpServer());

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
      const agent = request.agent(app.getHttpServer());

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

  describe.each(authRoutes)(
    'Validate Authenticated route %s',
    ({ method, path }) => {
      it('should return 401 if token is not provided', async () => {
        await request(app.getHttpServer())
          [method](path)
          .expect(401)
          .expect(({ body }) => {
            expect(body.message).toContain('Token not provided');
          });
      });

      it('should return 401 if token is invalid', async () => {
        await request(app.getHttpServer())
          [method](path)
          .set('Cookie', ['accessToken=invalid.token.here'])
          .expect(401)
          .expect(({ body }) => {
            expect(body.message).toContain('Invalid token');
          });
      });
    },
  );
});
