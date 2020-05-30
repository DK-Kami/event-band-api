import supertest from 'supertest';
import app from '../../index';
import {
  correctUser,
  wrongUser,
} from '../../__test__data/user';

describe('password change cases', () => {
  it('correct email should return 200', async () => {
    await supertest(app)
      .get('/request-password')
      .query({ email: correctUser.email })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'Check your email');
      });
  });

  it('incorrect email should return 400', async () => {
    await supertest(app)
      .get('/request-password')
      .query({ email: wrongUser.email })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'Email not found');
      });
  });
});
