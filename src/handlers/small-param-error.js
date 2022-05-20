module.exports = class SmallParamError extends Error {
  constructor() {
    super(`Small Param: Params so small or empty`)
    this.name = "SmallParamError";
  }
}