const mysql = require("../connection/conn").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  store (req, res, next) {

    const user = {
      username: req.body.username,
      email: req.body.email,
      user_password: req.body.user_password
    }

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ message: "Ocorreu um erro!", error: error });
      if(user.user_password.length < 6) return res.send({message: "Senha com menos de 6 caractes não é aceito!"})
      conn.query(
        "SELECT * FROM users WHERE email = ?", [user.email], (error, result, field) => {
          if(error) return res.status(500).send({ message: "Ocorreu um erro!", error: error });
          if(result.length > 0) {
            res.status(409).send({ message: "Email já existente" });
            return;
          }

          bcrypt.hash(user.user_password, 12, (errBcrypt, hash) => {
            if(errBcrypt) res.send({ error: errBcrypt });
            conn.query(
              "INSERT INTO users (username, email, user_password) VALUES (?,?,?);",
              [user.username, user.email, hash],
              (error, result, fields) => {
                conn.release();
                if(error) return res.status(500).send({ message: "Ocorreu um erro!", error: error });
    
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
              }
            );
          });
        }
      );
    });
  }

  login(req, res) {
    const user = {
      username: req.body.username,
      email: req.body.email,
      user_password: req.body.user_password
    }

    mysql.getConnection((error, conn) => {
      if(error) return res.status(500).send({ message: 'Houve um erro', error: error })
      const query = 'SELECT * FROM users WHERE email = ?';
      conn.query(query, [user.email], (error, result, field) => {
        conn.release();
        if(error) return res.status(500).send({ message: 'Houve um erro', error: error })

        if(result.length == 0) return res.status(401).send({ message: "Falha na autenticação" });

        bcrypt.compare(user.user_password, result[0].user_password, (error, results) => {
          if(error) return res.status(401).send({ message: "Falha na autenticação" });
          if(results) {
            const token = jwt.sign({
              id_user: result[0].id_user,
              email: result[0].email,
            }, process.env.JWT_KEY, {
              expiresIn: "1h"
            });
            return res.status(200).send({ message: "Autenticado com sucesso", token: token })
          };
          return res.status(401).send({ message: "Falha na autenticação" });
        });
      });
    });
  }
}

module.exports = new UserController();