const mysql = require("../connection/conn");
class DemandController {
  async index(req, res) {

    try {
      const query = `
        SELECT 
          clients.client_name,
          clients.id_client,
          demands.iddemands,
          demands.amounts,
          products.idproducts,
          products.price,
          products.name
        FROM demands
        INNER JOIN products
        ON products.idproducts = demands.idproducts
        INNER JOIN clients
        ON clients.id_client = demands.id_client
        WHERE clients.id_client = (?);
      `;

      const result = await mysql.execute(query, [req.client.id_client]);

      const response = {
        demands: result.map(demand => {
          return {
            id_demand: demand.iddemands,
            client_name: demand.client_name,
            product: {
              id_product: demand.idproducts,
              name: demand.name,
              price: demand.price,
              amount: demand.amounts,
              total_price: demand.amounts * demand.price
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/demands/" + demand.iddemands
            }
          }
        })
      }

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }

  async store(req, res) {
    try {
      const demand = {
        id_product: req.body.id_product,
        amounts: req.body.amounts
      };

      const query = "SELECT * FROM products WHERE idproducts=(?)";

      const result = await mysql.execute(query, [demand.id_product]);

      if (result.length == 0) {
        return res.status(404).send({
          message: "Nenhum pedido foi encontrado com esse ID"
        });
      }

      try {
        const query = "INSERT INTO demands(idproducts, amounts, id_client) VALUES (?,?,?)";

        const result = mysql.execute(query, [demand.id_product, demand.amounts, req.client.id_client]);

        if (result.length == 0) {
          return res.status(404).send({
            message: "Nenhum pedido foi encontrado com esse ID"
          });
        }

        const id_demands = result.insertId;

        const response = {
          message: "Pedido alterado com sucesso",
          id_demand: id_demands,
          demand: demand,
          request: {
            type: "POST",
            url: "http://localhost:3000/demands"
          }
        }

        return res.status(201).send(response);
      } catch (error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;

      const query = "SELECT * FROM demands WHERE iddemands=(?)";

      const result = await mysql.execute(query, [id]);

      if (result.length == 0) {
        return res.status(404).send({
          message: "Nenhum pedido foi encontrado com esse ID"
        });
      }

      const response = {
        demands: result.map(demand => {
          return {
            idproduct: demand.idproducts,
            amounts: demand.amounts,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + demand.idproducts
            }
          }
        }),
      }

      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }

  async update(req, res) {

    try {
      const id = req.params.id;

      const demand = {
        id_product: req.body.id_product,
        amount: req.body.amount,
      }

      const query = "SELECT * FROM demands WHERE idproducts=? AND iddemands=?";

      const params = [demand.id_product, id];

      const result = await mysql.execute(query, params);

      if(result.length == 0) {
        return res.status(401).send({ message: "Nenhum pedido foi encontrado com esse ID"});
      }

      try {
        
        const query = `
          UPDATE demands INNER JOIN clients 
            ON clients.id_client = demands.id_client
            set idproducts=(?), amounts=(?) 
          WHERE iddemands=(?) AND clients.id_client=(?);
        `;
  
        await mysql.execute(query, [demand.id_product, demand.amount, id, req.client.id_client]);
  
        const response = {
          message: "Pedido alterado com sucesso",
          id_demand: id,
          product: demand,
          request: {
            type: "PATCH",
            url: "http://localhost:3000/demands/" + id
          }
        }
  
        return res.status(201).send(response);
      } catch (error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }

    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }

  async delete(req, res) {

    const id = req.params.id;

    const query = "SELECT * FROM demands WHERE iddemands=?";

    const result = await mysql.execute(query, [id]);

    if (result.length == 0) {
      return res.status(404).send({
        message: "Nenhum pedido foi encontrado com esse ID"
      });
    }

    try {
      

      const query = "DELETE FROM demands WHERE iddemands=(?)";

      await mysql.execute(query, [id, req.client.id_client]);

      const date = Date.now();
      const currentDate = new Date(date);

      const response = {
        message: "Pedido deletado com sucesso",
        request: {
          type: "DELETE",
          date: currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString()
        }
      };

      return res.status(202).send(response);

    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }
}

module.exports = new DemandController();