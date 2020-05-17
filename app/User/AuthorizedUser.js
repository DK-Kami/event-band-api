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
      raw: true,
      where: {
        UserId: user.id,
        status: 1,
      },
      attributes: ['uuid'],
      include: [
        {
          model: OrganizationModel,
          attributes: ['uuid', 'name', 'reputation', 'logo'],
        },
        {
          model: TicketModel,
          attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
          order: [['datetimeTo', 'DESC']],
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
      if (subscribe['Organization.uuid']) {
        subOrgs.push({
          uuid: subscribe['Organization.uuid'],
          name: subscribe['Organization.name'],
          reputation: subscribe['Organization.reputation'],
          logo: subscribe['Organization.logo'],
        });
      }

      if (subscribe['Ticket.Event.uuid']) {
        const event = {
          uuid: subscribe['Ticket.Event.uuid'],
          name: subscribe['Ticket.Event.name'],
          description: subscribe['Ticket.Event.description'],
          coords: subscribe['Ticket.Event.coords'],
          datetimeTo: subscribe['Ticket.Event.datetimeTo'],
          datetimeFrom: subscribe['Ticket.Event.datetimeFrom'],
          tickets: [],
        };
        const ticket = {
          uuid: subscribe['Ticket.uuid'],
          name: subscribe['Ticket.name'],
          description: subscribe['Ticket.description'],
          count: subscribe['Ticket.count'],
          price: subscribe['Ticket.price'],
          datetimeTo: subscribe['Ticket.datetimeTo'],
          datetimeFrom: subscribe['Ticket.datetimeFrom'],
        };

        if (!subEvents.map(e => e.uuid).includes(event.uuid)) {
          event.tickets.push(ticket);
          subEvents.push(event);
        }
        else {
          subEvents.find(e => e.uuid === event.uuid).tickets.push(ticket);
        }
      }
    });

    subscriptions.forEach(subscribe => {
      // const {
      //   Ticket: ticket,
      //   Organization: organization,
      // } = subscribe;
  
      // if (organization) {
      //   subOrgs.push(organization);
      // }
      // if (ticket) {
      //   const event = ticket.Event;
      //   if (!subEvents.map(e => e.uuid).includes(event.uuid)) {
      //     Object.defineProperty(event, 'tickets', {
      //       value: [ticket],
      //     });
      //     // console.log(event);
      //     subEvents.push(event);
      //   }
      // }
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
