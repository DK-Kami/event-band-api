import supertest from 'supertest';
import app from '../../index';
import {
  getAllRouteQuery,
  getByUuidRoute,
  getAllRoute,
  anonimSubscribeOnEvent,
  anonimUserData,
  anonimUserDataWithnotFoundTicket,
} from '../../__test__data/event';

describe('public event routes', () => {
  it('should get all events', async () => {
    await supertest(app)
      .get(getAllRoute)
      .query(getAllRouteQuery)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('events');
      });
  });

  it('should get event by uuid', async () => {
    await supertest(app)
      .get(getByUuidRoute)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('event');
        expect(body).toHaveProperty('organization');
        expect(body).toHaveProperty('tags');
        expect(body).toHaveProperty('tickets');
      });
  });

  it('anonim subscribe on not real event', async () => {
    await supertest(app)
      .post(anonimSubscribeOnEvent)
      .send(anonimUserDataWithnotFoundTicket)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'ticket not found');
      });
  });
  test.skip('anonim subscribe on event', async () => {
    await supertest(app)
      .post(anonimSubscribeOnEvent)
      .send(anonimUserData)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });
  it('anonim subscribe on event with already taken email', async () => {
    await supertest(app)
      .post(anonimSubscribeOnEvent)
      .send(anonimUserData)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'email address is already registered at the event');
      });
  });
});
