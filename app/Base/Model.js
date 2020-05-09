import { v4 } from 'uuid';

class Model {
  constructor(Model) {
    this.Model = Model;
  }

  async getAll(queryObject) {
    const data = await this.Model.findAll(queryObject);
    return data;
  }

  async getById(id, raw = false) {
    const data = await this.Model.findByPk(id, { raw });
    return data;
  }

  async getOne(queryObject) {
    const data = await this.Model.findOne(queryObject)
    return data;
  }

  // async create(createData) {
  //   createData.uuid = v4();
  //   const data = await this.Model.create(createData);
  //   return data;
  // }

  async create(createData) {
    createData.uuid = v4();
    try {
      const newModel = await this.Model.create(createData);
      return newModel;
    }
    catch(error) {
      let message = 'very very bad request, but name: ' + error.name;

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

      return Promise.reject(message);
    }
  }
};

export default Model;
