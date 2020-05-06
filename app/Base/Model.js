class Model {
  constructor(model) {
    this.model = model;
  }

  async getAll(raw = true) {
    const data = await this.model.findAll({ raw });
    return data;
  }

  async getById(id, raw = false) {
    const data = await this.model.findByPk(id, { raw });
    return data;
  }
};

export default Model;
