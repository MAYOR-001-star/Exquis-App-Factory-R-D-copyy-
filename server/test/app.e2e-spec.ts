// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // enables DTO validation
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    firstName: 'Mayor',
    lastName: 'Abdulazeez',
    email: 'mayor@test.com',
    password: '123456',
    confirmPassword: '123456',
  };

  it('/auth/register (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Registration successful');
        expect(res.body.user).toHaveProperty('email', user.email);
      });
  });

  it('/auth/register (POST) - fail (duplicate email)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user) // same email again
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Email already in use');
      });
  });

  it('/auth/login (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Login successful');
        expect(res.body.user).toHaveProperty('email', user.email);
      });
  });

  it('/auth/login (POST) - fail (wrong password)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'wrongpass' })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Invalid credentials');
      });
  });
});
