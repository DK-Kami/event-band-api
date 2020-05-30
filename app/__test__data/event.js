const eventUuid = 'e9c976b2-a77c-442a-8ffd-ff2a3ff4ee6a';
const newTicketUuid = '29bd87f2-8f85-404a-ad1e-bdbf205e4822';
const notRealUuid = 'not-real-uuid';

export const getByUuidRoute = `/event/${eventUuid}`;
export const getAllRoute = '/event-list';

export const subscribeOnEvent = `/api/event/subscribe/${newTicketUuid}`;
export const subscribeOnNotRealEvent = `/api/event/subscribe/${notRealUuid}`;
export const unsubscribeFromEvent = `/api/event/unsubscribe/${newTicketUuid}`;

export const anonimSubscribeOnEvent = '/subscribe/';

export const getAllRouteQuery = {
  dateFrom: '2020-05-09',
  dateTo: '2020-08-15',
  priceTo: 2000,
  reputation: 7,
  priceFrom: 0,
  people: 5000,
  tags: [2, 16],
};

export const anonimUserData = {
  ticketUuid: newTicketUuid,
  email: 'anonim@user.com',
  surname: 'user',
  name: 'anonim',
};
export const anonimUserDataWithnotFoundTicket = {
  ticketUuid: notRealUuid,
  email: 'anonim@user.com',
  surname: 'user',
  name: 'anonim',
};
