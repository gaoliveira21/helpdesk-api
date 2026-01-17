import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/modules/app.module';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Allowed Origins Middleware', () => {
  let app: INestApplication<App>;
  const allowedOrigin = process.env.ALLOWED_ORIGINS?.split(',').map((origin) =>
    origin.trim(),
  )[0] as string;

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

  it('should return 403 if origin is not allowed', async () => {
    await request(app.getHttpServer())
      .post('/auth/csrf-token')
      .set('Origin', 'http://not-allowed-origin.com')
      .set('Referer', `${allowedOrigin}/some-path`)
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('Origin not allowed');
      });
  });

  it('should return 403 if referer is not allowed', async () => {
    await request(app.getHttpServer())
      .post('/auth/csrf-token')
      .set('Origin', allowedOrigin)
      .set('Referer', 'http://not-allowed-referer.com/some-path')
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe('Origin not allowed');
      });
  });

  it('should pass origin validation with allowed origin', async () => {
    await request(app.getHttpServer())
      .post('/auth/csrf-token')
      .set('Origin', allowedOrigin)
      .set('Referer', `${allowedOrigin}/some-path`)
      .expect(201);
  });
});
