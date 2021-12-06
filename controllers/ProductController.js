const mysql = require("../connection/conn");

class ProductController {
  async index(req, res) {

    try {
      const query = "SELECT * FROM products";

      const result = await mysql.execute(query);

      if (result.length == 0) {
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
            product_image: prod.product_image,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + prod.idproducts
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

      const product = {
        name: req.body.name,
        price: req.body.price,
        product_image: req.file.path.replace("\\", "/"),
      }

      const query = "UPDATE products set name=?, price=?, product_image=? WHERE idproducts=?";

      const field = [product.name, product.price, product.product_image, id];

      await mysql.execute(query, field);

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
    } catch (error) {
      return res.status(500).send({
        message: "Houve um erro!",
        error: error,
      });
    }
  }

  async store(req, res) {

    try {
      const product = {
        name: req.body.name,
        price: req.body.price,
        product_image: req.file.path.replace("\\", "/"),
      }

      const query = "INSERT INTO products(name, price, product_image) VALUES (?,?,?)";

      const fields = [product.name, product.price, product.product_image];

      const result = await mysql.execute(query, fields);

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

      const query = "SELECT * FROM products WHERE idproducts=(?)";

      const result = await mysql.execute(query, [id]);

      if (result.length == 0) {
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
            product_image: prod.product_image,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + prod.idproducts
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

  async delete(req, res) {

    try {
      const id = req.params.id;

      const query = "DELETE FROM products WHERE idproducts=?";

      await mysql.execute(query, [id]);

      const date = Date.now();
      const currentDate = new Date(date);

      const response = {
        message: "Produto deletado com sucesso",
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

module.exports = new ProductController();