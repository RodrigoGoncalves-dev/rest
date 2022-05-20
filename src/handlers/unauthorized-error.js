module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(`Unauthorized: ${message}`);
    this.name = "UnauthorizedError"
  }
}