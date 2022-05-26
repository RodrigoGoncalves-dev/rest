const mysql = require("../connection/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpResponse = require("../handlers/http-response");
const SmallParamError = require("../handlers/small-param-error");

class UserController {
  async store(req, res, next) {

    try {
      const { username, email, user_password } = req.body;

      if (email === "" || user_password.length < 6) return HttpResponse.badRequest(res, new SmallParamError());

      const query = "SELECT * FROM users WHERE email = ?";

      const field = [email];

      const result = await mysql.execute(query, field);

      if (result.length > 0) {
        HttpResponse.conflictError(res, "E-mail já existente");
        return;
      }

      bcrypt.hash(user_password, 12, async (errBcrypt, hash) => {
        const query = "INSERT INTO users (username, email, user_password) VALUES (?,?,?);";

        const field = [username, email, hash];

        const result = await mysql.execute(query, field);

        const id = result.insertId;

        const response = {
          message: "Usuário criado com sucesso",
          id_user: id,
          user: {
            username: username,
            email: email,
          }
        }

        return HttpResponse.created(res, response);
      });
    } catch (error) {
      return HttpResponse.serverError(res);
    }
  }

  async login(req, res) {
    try {
      const { email, user_password } = req.body;

      if (email === "" || user_password.length < 6) return HttpResponse.badRequest(res, new SmallParamError());

      const query = 'SELECT * FROM users WHERE email = ?';

      const result = await mysql.execute(query, [email]);

      if (result.length == 0) return HttpResponse.unprocessableError(res);

      bcrypt.compare(user_password, result[0].user_password, (error, results) => {
        if (error) return HttpResponse.unprocessableError(res);

        const token = jwt.sign({
          id_user: result[0].idusers,
          email: result[0].email,
        }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });

        const response = {
          message: "SuccessLogin",
          user_token: token
        }

        return HttpResponse.ok(res, response)
      });
    } catch (error) {
      if (error) return HttpResponse.serverError(res);
    }
  }
}

module.exports = new UserController();