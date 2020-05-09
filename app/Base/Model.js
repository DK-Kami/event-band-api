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

  async create(createData) {
    createData.uuid = v4();
    const data = await this.Model.create(createData);
    return data;
  }
  // async create(createData) {
  //   createData.uuid = v4();
  //   console.log('createData', createData)
  //   const newModel = this.Model.build(createData);
  //   // console.log('newModel', newModel);
  //   const isValid = await newModel.validate();
  //   console.log('validate', isValid);
  //   return newModel;
  //   // const data = await this.Model.create(createData);
  //   // return data;
  // }
};

export default Model;
