import supertest from 'supertest';
import app from '../app';

describe('server', () => {
  it('server should work', async () => {
    await supertest(app)
      .get('/ping')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });

  it('server should return 500 on wrong url', async () => {
    await supertest(app)
      .get('/wrong')
      .expect(500)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'method not implemented');
      });
  });
});
