import Organization from '../app/Organization/Organization';
import User from '../app/User/User';

function returnPermissionDenied(res) {
  return res.status(400).send({
    message: 'Permission denied! You have no power here, servant of Mordor.',
  });
}

/**
 * Middleware, обеспечивающий безопасность путей организации,
 * путём проверки, передаваемого токена и получения организации
 */
async function getOrganization(req, res) {
  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  if (!organizationUUID) {
    returnPermissionDenied(res);
  }

  const organization = await Organization.getByUUID(organizationUUID);
  const user = await User.getByUUID(userUUID);

  if (!organization || !user) {
    return returnPermissionDenied(res);
  }

  req.payload.organization = organization;
  req.payload.user = user;
  return true;
}

export {
  getOrganization,
};
