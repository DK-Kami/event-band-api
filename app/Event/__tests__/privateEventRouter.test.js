import supertest from 'supertest';
import app from '../../index';
import {
  getAllRouteQuery,
  getByUuidRoute,
  getAllRoute,
  subscribeOnEvent,
  subscribeOnNotRealEvent,
  unsubscribeFromEvent,
} from '../../__test__data/event';
import {
  authorizationToken,
} from '../../__test__data/main';

describe('private event routes', () => {
  it('should get all events', async () => {
    await supertest(app)
      .get(`/api/event/${getAllRoute}`)
      .set('authorization', authorizationToken)
      .query(getAllRouteQuery)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('events');
      });
  });

  test.skip('should get event by uuid', async () => {
    await supertest(app)
      .get(`/api/${getByUuidRoute}`)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('event');
        expect(body).toHaveProperty('organization');
        expect(body).toHaveProperty('tags');
        expect(body).toHaveProperty('tickets');
      });
  });

  it('should get events and organizations in recommended', async () => {
    await supertest(app)
      .get('/api/event/event-recommended')
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('events');
        expect(body).toHaveProperty('organizations');
      });
  });

  it('subscribe on not real event', async () => {
    await supertest(app)
      .get(subscribeOnNotRealEvent)
      .set('authorization', authorizationToken)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'ticket not found');
      });
  });
  it('subscribe on event', async () => {
    await supertest(app)
      .get(subscribeOnEvent)
      .set('authorization', authorizationToken)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });
  it('repeated subscribe on event should be 400', async () => {
    await supertest(app)
      .get(subscribeOnEvent)
      .set('authorization', authorizationToken)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'email address is already registered at the event');
      });
  });

  it('unsubscribe from event', async () => {
    await supertest(app)
      .get(unsubscribeFromEvent)
      .set('authorization', authorizationToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'all ok');
      });
  });
  it('repeat unsubscribe from event should be 400', async () => {
    await supertest(app)
      .get(unsubscribeFromEvent)
      .set('authorization', authorizationToken)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message', 'you are already unsubscribing from this event');
      });
  });
});
