const mysql = require("../connection/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ClientController {
  async store(req, res) {
    try {
      const client = {
        client_name: req.body.client_name,
        email: req.body.email,
        password: req.body.password,
      }
  
      if(client.password.length < 6) return res.status(500).send({ message: "Senha com menos de 6 caractes não é aceito!"});
  
      const query = "SELECT * FROM clients WHERE email = ?";
  
      const params = [client.email];
  
      const result = await mysql.execute(query, params);
  
      if(result.length > 0) {
        return res.status(409).send({ message: "Email já existente em nossa base de dados." });
      }
  
      bcrypt.hash(client.password, 12, async (errBcrypt, hash) => {
        const query = "INSERT INTO clients (client_name, email, client_password) VALUES(?,?,?)";
  
        const params = [client.client_name, client.email, hash];
  
        const result = await mysql.execute(query, params);
  
        const client_id = result.insertId;
  
        const response = {
          message: "Cliente criado com sucesso",
          client_id: client_id,
          client: {
            name: client.client_name,
            email: client.email
          }
        }
  
        return res.status(201).send(response);
      });
    } catch (error) {
      return res.status(500).send({ message: "Houve um erro", error: error});
    }
  }

  async login(req, res) {
    try {
      const client = {
        email: req.body.email,
        password: req.body.password,
      }

      const query = 'SELECT * FROM clients WHERE email = ?';

      const result = await mysql.execute(query, [client.email]);

      if(result.length == 0) return res.status(401).send({ message: "Falha na autenticação" });

      bcrypt.compare(client.password, result[0].client_password, (error, results) => {
        if(error) return res.status(401).send({ message: "Falha na autenticação" });
        if(results) {
          const token = jwt.sign({
            id_client: result[0].id_client,
            email: result[0].email,
          }, process.env.JWT_KEY, {
            expiresIn: "1h"
          });
          return res.status(200).send({ message: "Autenticado com sucesso", token: token })
        };
        return res.status(401).send({ message: "Falha na autenticação" });
      });
    } catch (error) {
      if(error) return res.status(500).send({ message: 'Houve um erro', error: error });
    }
  }
}

module.exports = new ClientController();