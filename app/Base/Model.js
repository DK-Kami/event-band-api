import { v4 } from 'uuid';

/**
 * Базовый класс модели
 */
class Model {
  /**
   * Конструктор класса
   * @param {Sequelize.Model} Model Объект класса Sequelize
   */
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * Метод для обработки ошибок валидации и базы данных
   * @param {Error} error Ошибка, вызванная при работе с БД
   */
  handleError(error) {
    let message = 'very very bad request, but name: ' + error.name + ' and error: ' + error;

    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      console.log('error', errors);
      message = errors[0];
    }
    else if (error.name === 'SequelizeUniqueConstraintError') {
      const {
        constraint,
        routine,
      } = error.original;

      switch(routine) {
        case '_bt_check_unique':
          const field = constraint.split('_')[1];
          message = field + ' is already taken';
        break;
      }
    }

    return message;
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
   */
  async getAll(queryObject) {
    const data = await this.Model.findAll(queryObject);
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
   */
  async getById(id, queryObject) {
    const data = await this.Model.findByPk(id, queryObject);
    return data;
  }

  /**
   * Возвращение записи по его UUID
   * @param {String} uuid UUID записи
   */
  async getByUUID(uuid) {
    const data = await this.Model.findOne({
      where: { uuid },
      raw,
    });
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
   */
  async getOne(queryObject) {
    const data = await this.Model.findOne(queryObject);
    return data;
  }

  /**
   * Метод для изменения записи
   * @param {Object} updateData Объект, содержащий изменяемые поля с новыми значениями
   * @param {Object} where Объект, содержащий поля поиска
   */
  async update(updateData = {}, where) {
    console.log(updateData, where);
    try {
      const updateModel = await this.getOne({ where });

      Object.keys(updateData).forEach(key => {
        updateModel[key] = updateData[key];
      });

      await updateModel.save();
      return updateModel;
    }
    catch(error) {
      console.log('here', error.name);
      const message = this.handleError(error);
      return Promise.reject(message);
    }
  }

  /**
   * Метод для создания модели
   * @param {Object} createData Объект, содержащий поля, для создания записи
   */
  async create(createData) {
    createData.uuid = v4();
    try {
      const newModel = await this.Model.create(createData);
      return newModel;
    }
    catch(error) {
      const message = this.handleError(error);
      return Promise.reject(message);
    }
  }

  /**
   * Метод либо вернёт объект, полученый после поиска по данным, переданными в первом параметре,
   * либо создаст новую запись со значениями из полей первого и второго параметра
   * @param {Object} createData Объект, содержащий поля поиска
   * @param {Object} defaults Объект с полями сущности и их значениями
   */
  async getOrCreate(createData, defaults) {
    const result = await this.getOne({ where: createData });

    if (result) {
      return {
        isCreate: false,
        isGet: true,
        model: result,
      }
    }

    createData.uuid = v4();
    try {
      const newModel = await this.Model.create(Object.assign({}, createData, defaults));
      return {
        isCreate: true,
        isGet: false,
        model: newModel,
      };
    }
    catch(error) {
      const message = this.handleError(error);
      return Promise.reject(message);
    }
  }
};

export default Model;
