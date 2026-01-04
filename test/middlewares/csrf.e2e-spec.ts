import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/modules/app.module';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Csrf Token Middleware', () => {
  let app: INestApplication<App>;

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

  it('should return 403 if CSRF token cookie is missing', async () => {
    await request(app.getHttpServer())
      .post('/auth')
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('CSRF token not provided');
      });
  });

  it('should return 403 if CSRF token header is missing', async () => {
    await request(app.getHttpServer())
      .post('/auth')
      .set('Cookie', ['csrfToken=valid-token'])
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('CSRF token not provided');
      });
  });

  it('should return 403 if CSRF token does not match cookie', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/csrf-token')
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth')
      .set('x-csrf-token', 'some-other-token')
      .set('Cookie', res.headers['set-cookie'])
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('CSRF token mismatch');
      });
  });

  it('should return 403 if CSRF token is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth')
      .set('x-csrf-token', 'invalid-token')
      .set('Cookie', ['csrfToken=invalid-token'])
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('Invalid CSRF token');
      });
  });

  it('should pass CSRF validation with valid token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/csrf-token')
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth')
      .set('x-csrf-token', res.body.csrfToken as string)
      .set('Cookie', res.headers['set-cookie'])
      .send({
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
      })
      .expect(201);
  });
});
