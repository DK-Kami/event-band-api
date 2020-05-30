import supertest from 'supertest';
import app from '../../index';
import {
  authorizationToken,
} from '../../__test__data/main';

it('get all subscribers', async () => {
  await supertest(app)
    .get('/api/subscriber/all')
    .set('authorization', authorizationToken)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toHaveProperty('subscribers');

      const { subscribers } = body;
      expect(Array.isArray(subscribers)).toBeTruthy();
    });
});
