import supertest from 'supertest';
import app from '../app';

it('server should work', async () => {
  await supertest(app)
    .get(`/ping`)
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toHaveProperty('message', 'all ok');
    });
});
