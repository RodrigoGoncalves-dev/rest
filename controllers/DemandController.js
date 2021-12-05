const mysql = require("../connection/conn").pool;
class DemandController {
  index(req, res) {
    
    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }

      conn.query(
        `
          SELECT 
            demands.iddemands,
            demands.amounts,
            products.idproducts,
            products.price,
            products.name
          FROM demands
          INNER JOIN products
          ON products.idproducts = demands.idproducts;
        `,
        (error, result, fields) => {
          conn.release();
          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

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
        }
      )
    });
  }

  store(req, res) {
    const demand = {
      id_product: req.body.id_product,
      amounts: req.body.amounts
    };

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }

      conn.query(
        "SELECT * FROM products WHERE idproducts=?",
        [demand.id_product],
        (error, result, field) => {
          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          if(result.length == 0) {
            return res.status(404).send({
              message: "Nenhum pedido foi encontrado com esse ID"
            });
          }

          conn.query(
            "INSERT INTO demands(idproducts, amounts) VALUES (?,?)",
            [demand.id_product, demand.amounts],
            (error, result, field) => {
              conn.release();
    
              if(error) {
                return res.status(500).send({
                  message: "Houve um erro!",
                  error: error,
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
            }
          );
        }
      );
    });
  }

  show(req, res) {
    const id = req.params.id;

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }

      conn.query(
        "SELECT * FROM demands WHERE iddemands=(?)",
        [id],
        (error, result, fields) => {
          conn.release();
          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          if(result.length == 0) {
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
        }
      );
    });
  }

  update(req, res) {

    const id = req.params.id;

    const demand = {
      id_product: req.body.id_product,
      amount: req.body.amount,
    }

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
      conn.query(
        "UPDATE demands set idproducts=?, amounts=? WHERE iddemands=?",
        [demand.id_product, demand.amount, id],
        (error, result, field) => {
          conn.release();

          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

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
        }
      );
    });
  }
  
  delete(req, res) {
    const id = req.params.id;

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
      conn.query(
        "DELETE FROM demands WHERE iddemands=?",
        [id],
        (error, result, field) => {
          conn.release();

          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          const date = Date.now();
          const actualDate = new Date(date);

          const response = {
            message: "Pedido deletado com sucesso",
            request: {
              type: "DELETE",
              date: actualDate.toLocaleDateString() + " " + actualDate.toLocaleTimeString()
            }
          };

          return res.status(202).send(response);
        }
      );
    });
  }
}

module.exports = new DemandController();