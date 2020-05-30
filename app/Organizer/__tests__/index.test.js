import supertest from 'supertest';
import app from '../../index';
import {
  authorizationToken,
} from '../../__test__data/main';

it('get sll organizers', async () => {
  await supertest(app)
    .get('/api/organizer/all')
    .set('authorization', authorizationToken)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toHaveProperty('organizers');

      const { organizers } = body;
      expect(Array.isArray(organizers)).toBeTruthy();
    });
});
