module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Данные не прошли валидацию на сервере';
    this.statusCode = 400;
  }
};
