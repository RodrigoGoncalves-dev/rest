const mysql = require("../connection/conn");
class DemandController {
  async index(req, res) {

    try {
      const query = `
        SELECT 
          demands.iddemands,
          demands.amounts,
          products.idproducts,
          products.price,
          products.name
        FROM demands
        INNER JOIN products
        ON products.idproducts = demands.idproducts;
      `;

      const result = await mysql.execute(query);

      const response = {
        demands: result.map(demand => {
          return {
            id_demand: demand.iddemands,
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

      const query = "SELECT * FROM products WHERE idproducts=?";

      const result = await mysql.execute(query, [demand.id_product]);

      if (result.length == 0) {
        return res.status(404).send({
          message: "Nenhum pedido foi encontrado com esse ID"
        });
      }

      try {
        const query = "INSERT INTO demands(idproducts, amounts) VALUES (?,?)";

        const result = mysql.execute(query, [demand.id_product, demand.amounts]);

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

      const query = "UPDATE demands set idproducts=?, amounts=? WHERE iddemands=?";

      const result = await mysql.execute(query, [demand.id_product, demand.amount, id]);

      const id_demand = result.insertId;

      const response = {
        message: "Pedido alterado com sucesso",
        id_demand: id_demand,
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
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      const query = "DELETE FROM demands WHERE iddemands=?";

      await mysql.execute(query, [id]);

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