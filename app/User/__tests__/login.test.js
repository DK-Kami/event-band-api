import supertest from 'supertest';
import app from '../../index';
import {
  correctUser,
  wrongUser,
} from '../../__test__data/user';

describe('login cases', () => {
  it('login as correct user', async () => {
    await supertest(app)
      .post('/login')
      .send(correctUser)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('user');

        const { user } = body;
        expect(user).toHaveProperty('token');
        expect(user).toHaveProperty('email', correctUser.email);
      });
  });

  it('login as wrong user', async () => {
    await supertest(app)
      .post('/login')
      .send(wrongUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'Incorrect email or password');
      });
  });

  it('login as empty user', async () => {
    await supertest(app)
      .post('/login')
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'The field must not be empty');
      });
  });
});
