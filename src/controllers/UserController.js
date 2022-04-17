const mysql = require("../connection/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  async store(req, res, next) {

    try {
      const user = {
        username: req.body.username,
        email: req.body.email,
        user_password: req.body.user_password
      }

      if (user.user_password.length < 6) return res.send({ message: "Senha com menos de 6 caractes não é aceito!" });

      const query = "SELECT * FROM users WHERE email = ?";

      const field = [user.email];

      const result = await mysql.execute(query, field);

      if (result.length > 0) {
        res.status(409).send({ message: "Email já existente" });
        return;
      }

      bcrypt.hash(user.user_password, 12, async (errBcrypt, hash) => {
        const query = "INSERT INTO users (username, email, user_password) VALUES (?,?,?);";

        const field = [user.username, user.email, hash];

        const result = await mysql.execute(query, field);

        const id = result.insertId;

        const response = {
          message: "Usuário criado com sucesso",
          id_user: id,
          user: {
            username: user.username,
            email: user.email,
          }
        }

        return res.status(201).send(response);
      });
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro!", error: error });
    }
  }

  async login(req, res) {
    try {
      const user = {
        email: req.body.email,
        user_password: req.body.user_password,
      }

      const query = 'SELECT * FROM users WHERE email = ?';

      const result = await mysql.execute(query, [user.email]);

      if (result.length == 0) return res.status(401).send({ message: "Falha na autenticação" });

      bcrypt.compare(user.user_password, result[0].user_password, (error, results) => {
        if (error) return res.status(401).send({ message: "Falha na autenticação" });

        const token = jwt.sign({
          id_user: result[0].idusers,
          email: result[0].email,
        }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        return res.status(200).send({ message: "Autenticado com sucesso", token: token })
      });
    } catch (error) {
      if (error) return res.status(500).send({ message: 'Houve um erro', error: error });
    }
  }
}

module.exports = new UserController();