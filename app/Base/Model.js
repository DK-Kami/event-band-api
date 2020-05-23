import { v4 } from 'uuid';
import ModelError from './Error';

class Model {
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * Метод для обработки ошибок валидации и базы данных
   * @param {Error} error Ошибка, вызванная при работе с БД
   */
  handleError(error) {
    const { name } = error;
    let message = 'very very bad request, but name: ' + name + ' and error: ' + error;

    switch(name) {
      case 'SequelizeValidationError': {
        const errors = error.errors.map(e => e.message);
        console.log('error', errors);
        message = errors[0];
      } break;

      case 'SequelizeDatabaseError':
      case 'SequelizeUniqueConstraintError': {
        const {
          constraint,
          routine,
          column,
        } = error.original;
  
        if (routine === '_bt_check_unique') {
          const field = constraint.split('_')[1];
          message = field + ' is already taken';
        }
        else if (routine === 'ExecConstraints') {
          message = column + ' must not be empty';
        }
      } break;

      case 'ModelError':
        message = error.message;
      break;
    };

    if (typeof name === 'undefined') {
      return error;
    }

    console.log(message);
    return message;
  }

  /**
   * Метод для отловки исключений при раоте с базой данных
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   * @param {String} done.message Сообщение об ошибке
   * @param {Object} done.model Модель, получения при выполнении запроса
   * @param {Strung} methodName Имя, выполняемого метода
   * @param  {...any} methodParams Параметры, передаваемые в метод
   */
  async errorCatching(done = () => {}, methodName, ...methodParams) {
    try {
      const data = await this.Model[methodName](...methodParams);
      done(null, data);
      return data;
    }
    catch(message) {
      const error = this.handleError(message)
      done(this.handleError(error));
      return message;
    }
  }

  /**
   * Метод для получения множества строк по переданному объекту запроса
   * @param {Object} queryObject Объект запроса, может содержат поля:
   * @param {Object} queryObject.where Объект содержащий поля и значения,
   * по которым будет вестись поиск
   * @param {Object} queryObject.defaults Объект cо значениями по умолчания
   * @param {Array} queryObject.attributes Массив названия стролбцов, которые нужно получить
   * @param {Array} queryObject.order Массив сортировки
   * @param {Array} queryObject.include Массив подключения связаных моделей, связанных с текущей
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async getAll(queryObject, done) {
    const data = await this.errorCatching(done, 'findAll', queryObject);
    return data;
  }

  /**
   * Возвращение записи по его ID
   * @param {Number} id ID записи
   * @param {Object} queryObject Объект запроса, может содержат поля:
   * @param {Object} queryObject.where Объект содержащий поля и значения,
   * по которым будет вестись поиск
   * @param {Object} queryObject.defaults Объект cо значениями по умолчания
   * @param {Array} queryObject.attributes Массив названия стролбцов, которые нужно получить
   * @param {Array} queryObject.order Массив сортировки
   * @param {Array} queryObject.include Массив подключения связаных моделей, связанных с текущей
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async getById(id, queryObject, done) {
    const data = await this.errorCatching(done, 'findByPk', id, queryObject);
    return data;
  }

  /**
   * Получение только одной записи из таблицы по параметрам
   * @param {Object} queryObject Объект запроса, может содержат поля:
   * @param {Object} queryObject.where Объект содержащий поля и значения,
   * по которым будет вестись поиск
   * @param {Object} queryObject.defaults Объект cо значениями по умолчания
   * @param {Array} queryObject.attributes Массив названия стролбцов, которые нужно получить
   * @param {Array} queryObject.order Массив сортировки
   * @param {Array} queryObject.include Массив подключения связаных моделей, связанных с текущей
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async getOne(queryObject, done) {
    const data = await this.errorCatching(done, 'findOne', queryObject);
    return data;
  }

  /**
   * Возвращение записи по его UUID
   * @param {String} uuid UUID записи
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async getByUUID(uuid, done) {
    const data = await this.getOne({
      where: { uuid },
    }, done);
    return data;
  }

  /**
   * Метод для изменения записи
   * @param {Object} updateData Объект, содержащий изменяемые поля с новыми значениями
   * @param {Object} where Объект, содержащий поля поиска
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async update(updateData = {}, where, done) {
    const data = this.errorCatching(done, 'update', updateData, { where });
    return data;
  }

  /**
   * Метод для создания модели
   * @param {Object} createData Объект, содержащий поля, для создания записи
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async create(createData, done) {
    createData.uuid = v4();
    const data = await this.errorCatching(done, 'create', createData);
    return data;
  }

  /**
   * Метод либо вернёт объект, полученый после поиска по данным, переданными в первом параметре,
   * либо создаст новую запись со значениями из полей первого и второго параметра
   * @param {Object} createData Объект, содержащий поля поиска
   * @param {Object} defaults Объект с полями сущности и их значениями
   * @param {Function} done Коллбэк-функция, вызываемая при волполнении запроса
   */
  async getOrCreate(createData, defaults, done = () => {}) {
    this.getOne({
      where: createData,
    }, (message, result) => {
      if (message) {
        done(message);
        console.log(message);
        return { message, model: null };
      }

      if (result) {
        const returnData = {
          isCreate: false,
          isGet: true,
          model: result,
        };
  
        done(null, returnData);
        return returnData;
      }

      this.create(Object.assign({}, createData, defaults), (message, newModel) => {
        if (message) {
          done(message);
          return { message, model: null };
        }
        const returnData = {
          isCreate: true,
          isGet: false,
          model: newModel,
        };
    
        done(null, returnData);
        return returnData;
      });
    });
  }
};

export default Model;
