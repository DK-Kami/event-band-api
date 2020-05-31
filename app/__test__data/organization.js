const organizationUuid = '989713f3-2f0b-4a14-b863-d98b5c00f94e';
const notRealUuid = 'not-real-uuid';

export const getAllRoute = '/api/organization/all';
export const getByUuidRoute = `/organization/${organizationUuid}`;
export const getByNotRealUuidRoute = `/organization/${notRealUuid}`;

export const subscribeOnOrganizationRoute = `/api/organization/subscribe/${organizationUuid}`;
export const subscribeOnNotRealOrganizationRoute = `/api/organization/subscribe/${notRealUuid}`;
export const unSubscribeFromOrganizationRoute = `/api/organization/unsubscribe/${organizationUuid}`;

export const createOrganizationRoute = '/api/organization/create';
export const organizationData = {
  name: 'new organization',
  description: 'new organization description',
};
