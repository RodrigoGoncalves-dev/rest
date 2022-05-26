const ConflictError = require('./conflict-error');
const ServerError = require('./server-error');
const UnauthorizedError = require('./unauthorized-error');
const UnprocessableError = require('./unprocessable-error');

module.exports = class HttpResponse {
  static badRequest(res, error) {
    return res.status(400).send({
      statusCode: 400,
      body: {
        message: error.message,
        error: error.name,
      }
    });
  };

  static notFound(res, message) {
    return res.status(404).send({
      statusCode: 404,
      message: message,
    })
  }

  static conflictError(res, errMessage) {
    return res.status(409).send({
      statusCode: 409,
      body: {
        message: new ConflictError(errMessage).message,
        error: new ConflictError(errMessage).name
      }
    });
  };

  static serverError(res) {
    return res.status(500).send({
      statusCode: 500,
      body: {
        message: new ServerError().message,
        error: new ServerError().name,
      },
    });
  };

  static unprocessableError(res) {
    return res.status(422).send({
      statusCode: 422,
      body: {
        message: new UnprocessableError().message,
        error: new UnprocessableError().name,
      }
    });
  }

  static unauthorizedError(res, message) {
    return res.status(401).send({
      statusCode: 401,
      body: {
        message: new UnauthorizedError(message).message,
        error: new UnauthorizedError(message).name
      },
    });
  };

  static ok(res, data) {
    
    return res.status(200).send({
      statusCode: 200,
      body: data,
    })
  }

  static created(res, data) {
    return res.status(201).send({
      statusCode: 201,
      body: data,
    });
  };

  static deleted(res, data) {
    return res.status(202).send({
      statusCode: 202,
      body: data,
    });
  };
}