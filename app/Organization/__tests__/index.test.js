import supertest from 'supertest';
import app from '../../index';
import {
  getAllRoute,
  getByUuidRoute,
  getByNotRealUuidRoute,
  subscribeOnNotRealOrganizationRoute,
  subscribeOnOrganizationRoute,
  unSubscribeFromOrganizationRoute,
} from '../../__test__data/organization';
import { authorizationToken } from '../../__test__data/main';

describe('organization routes', () => {
  it('should get all orgaizations', async () => {
    await supertest(app)
      .get(getAllRoute)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('organizations');

        const { organizations } = body;
        expect(Array.isArray(organizations)).toBeTruthy();
      });
  });

  it('should get organization by uuid', async () => {
    await supertest(app)
      .get(`/api/${getByUuidRoute}`)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('organization');
        expect(body).toHaveProperty('organizers');
        expect(body).toHaveProperty('events');
        expect(body).toHaveProperty('subscribers');
      });
  });
  it('get organization by not real uuid should return 400', async () => {
    await supertest(app)
      .get(`/api/${getByNotRealUuidRoute}`)
      .set('authorization', authorizationToken)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'organization not found');
      });
  });

  it('subscribe on not real orgaization', async () => {
    await supertest(app)
      .get(subscribeOnNotRealOrganizationRoute)
      .set('authorization', authorizationToken)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'organization not found');
      });
  });
  it('subscribe on orgaization', async () => {
    await supertest(app)
      .get(subscribeOnOrganizationRoute)
      .set('authorization', authorizationToken)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });
  it('repeated subscribe on orgaization should be 400', async () => {
    await supertest(app)
      .get(subscribeOnOrganizationRoute)
      .set('authorization', authorizationToken)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'email address is already in this organization');
      });
  });

  it('unsubscribe from orgaization', async () => {
    await supertest(app)
      .get(unSubscribeFromOrganizationRoute)
      .set('authorization', authorizationToken)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });
  it('repeat unsubscribe from orgaization should be 400', async () => {
    await supertest(app)
      .get(unSubscribeFromOrganizationRoute)
      .set('authorization', authorizationToken)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'you are already out of this organization');
      });
  });
});
