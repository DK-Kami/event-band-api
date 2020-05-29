import Organization from "../app/Organization/Organization";
import User from "../app/User/User";

/**
 * Middleware, обеспечивающий безопасность путей организации,
 * путём проверки, передаваемого токена и получения организации
 */
async function getOrganization(req, res) {
  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  console.log('are u clown?', organizationUUID, userUUID);
  if (!organizationUUID) {
    return res.status(400).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const organization = await Organization.getByUUID(organizationUUID);
  const user = await User.getByUUID(userUUID);

  req.payload.organization = organization;
  req.payload.user = user;
}

export {
  getOrganization,
};
