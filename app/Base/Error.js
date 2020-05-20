class ModelError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ModelError';
  }
}

export default ModelError;
