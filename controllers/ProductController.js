const mysql = require("../connection/conn").pool;
class ProductController {
  index(req, res) {

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
      conn.query(
        "SELECT * FROM products",
        (error, result, field) => {
          conn.release();
          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          if(result.length == 0) {
            return res.status(404).send({
              message: "Nenhum produto foi encontrado"
            });
          }

          const response = {
            amount: result.length,
            products: result.map(prod => {
              return {
                idproduct: prod.idproducts,
                name: prod.name,
                price: prod.price,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/products/" + prod.idproducts
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

    const product = {
      name: req.body.name,
      price: req.body.price,
    }

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
      conn.query(
        "UPDATE products set name=?, price=? WHERE idproducts=?",
        [product.name, product.price, id],
        (error, result, field) => {
          conn.release();

          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          const id = result.insertId;

          const response = {
            message: "Produto alterado com sucesso",
            idproduct: id,
            product: product,
            request: {
              type: "PATCH",
              url: "http://localhost:3000/products/" + id
            }
          }

          return res.status(201).send(response);
        }
      );
    });
  }

  store(req, res) {

    const product = {
      name: req.body.name,
      price: req.body.price,
    }

    mysql.getConnection((error, conn) => {
      if(error) {
        return res.status(500).send({
          message: "Houve um erro!",
          error: error,
        });
      }
      conn.query(
        "INSERT INTO products(name, price) VALUES (?,?)",
        [product.name, product.price],
        (error, result, field) => {
          conn.release();

          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          const id = result.insertId;

          const response = {
            message: "Produto criado com sucesso",
            idproduct: id,
            product: product,
            request: {
              type: "POST",
              url: "http://localhost:3000/products"
            }
          }

          return res.status(201).send(response);
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
        "SELECT * FROM products WHERE idproducts=(?)",
        [id],
        (error, result, fields) => {
          if(error) {
            return res.status(500).send({
              message: "Houve um erro!",
              error: error,
            });
          }

          if(result.length == 0) {
            return res.status(404).send({
              message: "Nenhum produto foi encontrado com esse ID"
            });
          }

          const response = {
            products: result.map(prod => {
              return {
                idproduct: prod.idproducts,
                name: prod.name,
                price: prod.price,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/products/" + prod.idproducts
                }
              }
            }),
          }

          return res.status(200).send(response);
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
        "DELETE FROM products WHERE idproducts=?",
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
            message: "Produto deletado com sucesso",
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

module.exports = new ProductController();