import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@hey.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'usejfdkl',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@hey.com',
      password: 'pa'
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app) // if using multiple requests inside an it function, the it function must be async and have await before the first item(s) and either await or return for the last
    .post('/api/users/signup')
    .send({
      email: 'user@hey.com'
    })
    .expect(400);
  
  return request(app)
    .post('/api/users/signup')
    .send({
      password: 'password'
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@hey.com',
      password: 'password'
    })
    .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'user@hey.com',
        password: 'password'
      })
      .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@hey.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});