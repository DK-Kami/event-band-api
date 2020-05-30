import supertest from 'supertest';
import app from '../../index';
import {
  authorizationToken,
} from '../../__test__data/main';

it('get all tickets', async () => {
  await supertest(app)
    .get('/api/ticket/all')
    .set('authorization', authorizationToken)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toHaveProperty('tickets');

      const { tickets } = body;
      expect(Array.isArray(tickets)).toBeTruthy();
    });
});
