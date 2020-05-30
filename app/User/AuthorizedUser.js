import nodemailer from 'nodemailer';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import crypto from 'crypto';
import { v4 } from 'uuid';

import Organization from '../Organization/Organization';
import Subscriber from '../Subscriber/Subscriber';
import models from '../../db/models';
import Model from '../Base/Model';
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

  /**
   * Метод для создания объекта модели
   * @param {Object} data Данные для создания новой модели
   * @param {Function} done Колбэк-функция
   */
  async create(data, done) {
    data.salt = crypto.randomBytes(16).toString('hex');
    data.password = this.cryptoPassword(data.password, data.salt);
    data.uuid = v4();

    const authUser = await this.errorCatching(done, 'create', data);
    return authUser;
  }

  /**
   * Метод для шифрации пароля пользователя
   * @param {String} password Паролья пользователя
   * @param {String} salt Соль для шифрации пароля пользователя
   */
  cryptoPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return hash;
  }

  /**
   * Метод для генерации jwt-токена
   * @param {String} authUserUUID UUID модели авторизованного пользователя
   * @param {String} userUUID UUID модели пользователя
   */
  generateJWT(authUserUUID, userUUID) {
    return jwt.sign({
      uuid: userUUID,
      authUserUUID,
      userUUID,
    }, 'secret');
  }
  /**
   * Модель, возвращающая данные при авторизации или регистрации
   * @param {AuthorizedUser} authUser Модель авторизованного пользователя
   * @param {User} user Модель пользователя
   */
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

  /**
   * Метод для получения полной информации о пользователе
   * @param {String} uuid UUID модели пользователя
   */
  async getProfile(uuid) {
    const user = await User.getByUUID(uuid);
    if (!user) return { message: 'user not found' };

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
              include: [
                { model: OrganizationModel },
              ],
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
          organization: {
            uuid: subscribe['Ticket.Event.Organization.uuid'],
            name: subscribe['Ticket.Event.Organization.name'],
            reputation: subscribe['Ticket.Event.Organization.reputation'],
            logo: subscribe['Ticket.Event.Organization.logo'],
          },
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

  /**
   * Метод для отправки сообщения на почту пользователя
   * @param {String} email Электронная почта пользователя
   * @param {String} refreshToken Токен для сброса пароля
   */
  async sendEmail(email, refreshToken = '') {
    const message = {
      from: 'info.event.band@gmail.com',
      to: email,
      subject: 'Смена пароля',
      text: 'Перейдите по ссылке для смены пароля: https://event-band-api.ru/create-new-password/' + refreshToken,
      html: `
        <div>
          <span>Перейдите по ссылке для смены пароля: </span>
          <a href="https://event-band-api.ru/create-new-password/${refreshToken}">https://event-band-api.ru/create-new-password/${refreshToken}</a>
        </div>
      `,
    };
    console.log(email);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      // auth: {
      //   user: "lukecmascript@gmail.com",
      //   pass: "Osufucktrap3221488",
      // },
      // host: 'smtp.yandex.ru',
      // port: 465,
      // secure: true,
      service: 'Gmail',
      auth: {
        user: "info.event.band.api@gmail.com",
        pass: "Pass2EventBand!"
      }
    });
    
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
        return 'whaaaaat';
      }

      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return 'all ok';
    });
    console.log(email);

    // smtpTransport.sendMail(mailOptions, (error, info) => {
    //   // console.log('Message sent: %s', info.messageId);
    //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    //   if (error) return error;
    //   return 'Preview URL: %s', nodemailer.getTestMessageUrl(info);
    // });
  }
};

export default new AuthorizedUser();
