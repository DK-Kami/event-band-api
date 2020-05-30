import supertest from 'supertest';
import app from '../../index';
import {
  newUserWithIncorrectEmail,
  newUser,
} from '../../__test__data/user';

describe('register cases', () => {
  test.skip('register user', async () => {
    await supertest(app)
      .post('/register')
      .send(newUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('user');
      });
  });

  it('register user with already taken email', async () => {
    await supertest(app)
      .post('/register')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'email is already taken');
      });
  });

  it('register user with uncorrect email', async () => {
    await supertest(app)
      .post('/register')
      .send(newUserWithIncorrectEmail)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'Please enter a valid email address');
      });
  });
});
