import { v4 } from 'uuid';

class Model {
  constructor(Model) {
    this.Model = Model;
  }

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

  async getAll(queryObject) {
    const data = await this.Model.findAll(queryObject);
    return data;
  }

  async getById(id, raw = false) {
    const data = await this.Model.findByPk(id, { raw });
    return data;
  }
  async getByUUID(uuid, raw = false) {
    const data = await this.Model.findOne({
      where: { uuid },
      raw,
    });
    return data;
  }

  async getOne(queryObject) {
    const data = await this.Model.findOne(queryObject)
    return data;
  }

  async update(updateData = [], where) {
    console.log(updateData, where);
    try {
      const updateModel = await this.getOne({ where });

      Object.keys(updateData).forEach(key => {
        updateModel[key] = updateData[key];
      });

      updateModel.save();
      return updateModel;
    }
    catch(error) {
      const message = this.handleError(error);
      return Promise.reject(message);
    }
  }

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
};

export default Model;
