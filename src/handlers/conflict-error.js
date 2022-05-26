module.exports = class ConflictError extends Error {
  constructor(errMessage) {
    super(`Conflict: ${errMessage}`);
    this.name = "ConflictError";
  }
}