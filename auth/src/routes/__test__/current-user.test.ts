import request from 'supertest';
import { app } from '../../app';
import { signInCookie } from '../../test/setup';

it('responds with details about the current user', async () => {
  const cookie = await signInCookie();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('testuser@hey.com')
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  
  expect(response.body.currentUser).toEqual(null);
});