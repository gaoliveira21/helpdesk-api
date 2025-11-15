import request from 'supertest';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/modules/app.module';
import TestAgent from 'supertest/lib/agent';

describe('Users', () => {
  let app: INestApplication<App>;
  let agent: TestAgent;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    agent = request.agent(app.getHttpServer());

    await agent.post('/auth').send({
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PATCH /users/password', () => {
    it.each(['', '123', '12345'])(
      'should return a BadRequest error if new password is invalid',
      async (newPassword) => {
        await agent
          .patch('/users/password')
          .send({ newPassword, currentPassword: 'ValidCurrentPassword1' })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it.each(['', '123', '12345'])(
      'should return a BadRequest error if current password is invalid',
      async (currentPassword) => {
        await agent
          .patch('/users/password')
          .send({ newPassword: 'ValidNewPassword1', currentPassword })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it('should update the user password successfully', async () => {
      await agent
        .patch('/users/password')
        .send({
          newPassword: 'NewValidPassword1',
          currentPassword: process.env.DEFAULT_ADMIN_PASSWORD,
        })
        .expect(204);

      await agent
        .post('/auth')
        .send({
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: 'NewValidPassword1',
        })
        .expect(201);

      // Revert password change for other tests
      await agent
        .patch('/users/password')
        .send({
          newPassword: process.env.DEFAULT_ADMIN_PASSWORD,
          currentPassword: 'NewValidPassword1',
        })
        .expect(204);
    });
  });
});
