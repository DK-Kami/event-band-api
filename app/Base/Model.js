import { v4 } from 'uuid';

class Model {
  constructor(model) {
    this.model = model;
  }

  async getAll(queryObject) {
    const data = await this.model.findAll(queryObject);
    return data;
  }

  async getById(id, raw = false) {
    const data = await this.model.findByPk(id, { raw });
    return data;
  }

  async getOne(queryObject) {
    const data = await this.model.findOne(queryObject)
    return data;
  }

  async create(createData) {
    createData.uuid = v4();
    const data = await this.model.create(createData);
    return data;
  }
};

export default Model;
