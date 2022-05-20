const mysql = require("../connection/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpResponse = require("../handlers/http-response");
const SmallParamError = require("../handlers/small-param-error");

class ClientController {
  async store(req, res) {
    try {
      const { client_name, email, password } = req.body;

      if (email === "") return HttpResponse.badRequest(res, SmallParamError(email));

      if (password.length < 6) return HttpResponse.badRequest(res, SmallParamError(password));

      const query = "SELECT * FROM clients WHERE email = ?";

      const params = [email];

      const result = await mysql.execute(query, params);

      if (result.length > 0) {
        return HttpResponse.conflictError(res, "Email já existente em nossa base de dados.");
      }

      bcrypt.hash(password, 12, async (errBcrypt, hash) => {
        const query = "INSERT INTO clients (client_name, email, client_password) VALUES(?,?,?)";

        const params = [client_name, email, hash];

        const result = await mysql.execute(query, params);

        const client_id = result.insertId;

        const response = {
          message: "Cliente criado com sucesso",
          client_id: client_id,
          client: {
            name: client_name,
            email: email
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
      const { email, password } = req.body;

      const query = 'SELECT * FROM clients WHERE email = ?';

      const result = await mysql.execute(query, [email]);

      if (result.length == 0) return HttpResponse.unauthorizedError(res, "Falha na auntenticação");

      bcrypt.compare(password, result[0].client_password, (error, results) => {
        if (error) return HttpResponse.unauthorizedError(res, "Falha na auntenticação");
        if (results) {
          const token = jwt.sign({
            id_client: result[0].id_client,
            email: result[0].email,
          }, process.env.JWT_KEY, {
            expiresIn: "1h"
          });
          return HttpResponse.ok(res, "Autenticado com sucesso", token)
        };
        return HttpResponse.unauthorizedError(res, "Falha na auntenticação");
      });
    } catch (error) {
      if (error) return HttpResponse.serverError(res);
    }
  }
}

module.exports = new ClientController();