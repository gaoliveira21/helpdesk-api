import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import TestAgent from 'supertest/lib/agent';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';

import { ServiceRepository } from 'src/@core/application/ports/repositories/service_repository.port';
import { AppModule } from 'src/modules/app.module';

describe('Tickets', () => {
  let app: INestApplication<App>;
  let agent: TestAgent;
  let serviceRepository: ServiceRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
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

  describe('POST /tickets/services', () => {
    it.each([null, undefined, '', '12', 'a'.repeat(51)])(
      'should return 400 if name is invalid',
      async (name) => {
        await agent
          .post('/tickets/services')
          .send({
            name,
            price: 100.0,
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it.each([null, undefined, 0, -100])(
      'should return 400 if price is invalid',
      async (price) => {
        await agent
          .post('/tickets/services')
          .send({
            name: 'Valid Name',
            price,
          })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toContain('Validation failed');
          });
      },
    );

    it('should create a service with valid data', async () => {
      const response = await agent
        .post('/tickets/services')
        .send({
          name: 'Valid Service',
          price: 150.0,
        })
        .expect(201);

      const createdService = await serviceRepository.findById(
        response.body.id as string,
      );

      expect(response.body).toHaveProperty('id');
      expect(createdService).not.toBeNull();
      expect(createdService?.name).toBe('Valid Service');
      expect(createdService?.price.value).toBe(150.0);
    });
  });
});
