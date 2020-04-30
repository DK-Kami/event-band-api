const ModelBase = require('../Base/Model');

class Tag extends ModelBase {
  constructor(uuid, name) {
    this.name = name;
    this.uuid = uuid;
  }
};

module.exports = Tag;
