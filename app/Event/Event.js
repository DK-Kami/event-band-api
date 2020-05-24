import Model from '../Base/Model';
import models from '../../db/models';
const {
  Event: EventModel,
} = models;

class Event extends Model {
  constructor() {
    super(EventModel);
  }

  /**
   * Метод, возращающий массив событий в отформатированном виде
   * @param {Array} events Массив событий, полученных ответом от сервера
   * @param {Function} done Колбэк-функция
   */
  async getFormattingEvents(events, done) {
    return events;
  }

  /**
   * Функция, возвращающая переданное событие в отформатированном виде
   * @param {Object} event Объект модели Event
   * @param {Function} done колбэк-функция
   */
  async getFormattingEvent(event, done) {
    return event;
  }
};

export default new Event();
