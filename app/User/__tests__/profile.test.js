import supertest from 'supertest';
import app from '../../index';
import {
  newUserInfoWithAlreadyUsedEmail,
  newUserInfo,
} from '../../__test__data/user';
import { authorizationToken } from '../../__test__data/main';

describe('Profile routes', () => {
  it('should return profile current user', async () => {
    await supertest(app)
      .get('/api/profile')
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('user');
        expect(body).toHaveProperty('organizations');
        expect(body).toHaveProperty('subscriptions');

        const {
          organizations,
        } = body;

        expect(Array.isArray(organizations)).toBeTruthy();
      });
  });

  it('should return error when email already taken', async () => {
    await supertest(app)
      .put('/api/profile')
      .set('authorization', authorizationToken)
      .send(newUserInfoWithAlreadyUsedEmail)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'email is already taken');
      });
  });

  it('should update user profile', async () => {
    await supertest(app)
      .put('/api/profile')
      .set('authorization', authorizationToken)
      .send(newUserInfo)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('user');

        const { user } = body;
        expect(user).toHaveProperty('nickname', 'new test nickname');
      });
  });
});
