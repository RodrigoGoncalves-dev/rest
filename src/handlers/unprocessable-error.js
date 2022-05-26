module.exports = class UnprocessableError extends Error {
  constructor(){
    super("Unprocessable data.");
    this.name = "UnprocessableError";
  }
}