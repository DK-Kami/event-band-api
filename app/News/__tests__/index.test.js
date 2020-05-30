import supertest from 'supertest';
import app from '../../index';
import {
  authorizationToken,
} from '../../__test__data/main';

it('get all news', async () => {
  await supertest(app)
    .get('/api/news/all')
    .set('authorization', authorizationToken)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toHaveProperty('news');

      const { news } = body;
      expect(Array.isArray(news)).toBeTruthy();
    });
});
