module.exports = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 500;
  }
};
