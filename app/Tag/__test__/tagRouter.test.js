import supertest from 'supertest';
import app from '../../index';
import {
  tagByUuidRoute,
  tagAllRoute,
} from '../../__test__data/tag';
import {
  authorizationToken,
} from '../../__test__data/main';

describe('private tags routes', () => {
  it('get all tags', async () => {
    await supertest(app)
      .get(`/api/${tagAllRoute}`)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('tags');

        const { tags } = body;
        expect(Array.isArray(tags)).toBeTruthy();
      });
  });

  it('get tag by uuid', async () => {
    await supertest(app)
      .get(`/api/${tagByUuidRoute}`)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('tag');

        const { tag } = body;
        expect(tag).toHaveProperty('name', 'Anime');
      });
  });
});
