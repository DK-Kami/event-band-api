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
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        console.log('error', errors);
        return Promise.reject(errors[0]);
      }
    }
    // const newModel = this.Model.build(createData);
    // console.log('newModel', newModel);
    // const isValid = await newModel.validate();
    // console.log('validate', isValid);
    // const data = await this.Model.create(createData);
    // return data;
  }
};

export default Model;
