import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import crypto from 'crypto';
import { Op } from 'sequelize';
import Model from '../Base/Model';
import models from '../../db/models';
import Organization from '../Organization/Organization';
import Subscriber from '../Subscriber/Subscriber';
import User from './User';

const {
  AuthorizedUser: AuthorizedUserModel,
  Organization: OrganizationModel,
  Ticket: TicketModel,
  Event: EventModel,
} = models;

class AuthorizedUser extends Model {
  constructor() {
    super(AuthorizedUserModel);
  }

  async create(data) {
    data.salt = crypto.randomBytes(16).toString('hex');
    data.password = this.cryptoPassword(data.password, data.salt);
    const authUser = await this.Model.create(data);
    return authUser;
  }

  cryptoPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return hash;
  }

  generateJWT(authUserUUID, userUUID) {
    return jwt.sign({
      uuid: userUUID,
      authUserUUID,
      userUUID,
    }, 'secret');
  }
  toAuthJSON(authUser, user) {
    const avatar = gravatar.url(user.email, { s: 200 });

    return {
      authUserUUID: authUser.uuid,
      userUUID: user.uuid,
      uuid: user.uuid,
      nickname: authUser.nickname,
      token: authUser.token,
      surname: user.surname,
      email: user.email,
      name: user.name,
      avatar,
    };
  }

  async getProfile(uuid) {
    const user = await User.getByUUID(uuid);
    const authUser = await user.getAuthorizedUser();
    const organizers = await user.getOrganizers();

    const orgIds = organizers.map(o => o.OrganizationId);
    const organizations = await Organization.getAll({
      attributes: ['uuid', 'name', 'reputation', 'logo'],
      where: {
        id: {
          [Op.in]: orgIds,
        },
      },
    });

    const subscriptions = await Subscriber.getAll({
      where: { UserId: user.id },
      attributes: ['uuid'],
      include: [
        {
          model: OrganizationModel,
          attributes: ['uuid', 'name', 'reputation', 'logo'],
        },
        {
          model: TicketModel,
          attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
          include: [
            {
              model: EventModel,
              attributes: ['uuid', 'name', 'description', 'coords', 'datetimeTo', 'datetimeFrom'],
            },
          ],
        },
      ],
    });

    const subOrgs = [];
    const subEvents = [];
    subscriptions.forEach(subscribe => {
      const {
        Ticket: ticket,
        Organization: organization,
      } = subscribe;
  
      if (organization) {
        subOrgs.push(organization);
      }
      if (ticket) {
        subEvents.push(ticket.Event);
      }
    });

    return {
      user: this.toAuthJSON(authUser, user),
      subscriptions: {
        organizations: subOrgs,
        events: subEvents,
      },
      organizations,
      da: 'da'
    };
  }
};

export default new AuthorizedUser();
