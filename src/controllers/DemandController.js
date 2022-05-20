const mysql = require("../connection/conn");
const HttpResponse = require("../handlers/http-response");
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
            id_demand: iddemands,
            client_name: client_name,
            product: {
              id_product: idproducts,
              name: name,
              price: price,
              amount: amounts,
              total_price: amounts * price
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/demands/" + iddemands
            }
          }
        })
      }

      return HttpResponse.ok(res, response);
    } catch (error) {
      return HttpResponse.serverError(res);
    }
  }

  async store(req, res) {
    try {
      const { id_product, amounts } = req.body;

      const query = "SELECT * FROM products WHERE idproducts=(?)";

      const result = await mysql.execute(query, [id_product]);

      if (result.length == 0) {
        return HttpResponse.notFound(res, "Nenhum pedido foi encontrado com esse ID");
      }

      try {
        const query = "INSERT INTO demands(idproducts, amounts, id_client) VALUES (?,?,?)";

        const result = mysql.execute(query, [id_product, amounts, req.client.id_client]);

        if (result.length == 0) {
          return HttpResponse.notFound(res, "Nenhum pedido foi encontrado com esse ID");
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

        return HttpResponse.created(res, response);
      } catch (error) {
        return HttpResponse.serverError(res);
      }
    } catch (error) {
      return HttpResponse.serverError(res);
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;

      const query = "SELECT * FROM demands WHERE iddemands=(?)";

      const result = await mysql.execute(query, [id]);

      if (result.length == 0) {
        return HttpResponse.notFound(res, "Nenhum pedido foi encontrado com esse ID");
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

      return HttpResponse.ok(res, response);
    } catch (error) {
      return HttpResponse.serverError(res);
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

      const params = [id_product, id];

      const result = await mysql.execute(query, params);

      if (result.length == 0) {
        return HttpResponse.notFound(res, "Nenhum pedido foi encontrado com esse ID");
      }

      try {

        const query = `
          UPDATE demands INNER JOIN clients 
            ON clients.id_client = demands.id_client
            set idproducts=(?), amounts=(?) 
          WHERE iddemands=(?) AND clients.id_client=(?);
        `;

        await mysql.execute(query, [id_product, amount, id, req.client.id_client]);

        const response = {
          message: "Pedido alterado com sucesso",
          id_demand: id,
          product: demand,
          request: {
            type: "PATCH",
            url: "http://localhost:3000/demands/" + id
          }
        }

        return HttpResponse.ok(res, response);
      } catch (error) {
        return HttpResponse.serverError(res);
      }

    } catch (error) {
      return HttpResponse.serverError(res);
    }
  }

  async delete(req, res) {

    const id = req.params.id;

    const query = "SELECT * FROM demands WHERE iddemands=?";

    const result = await mysql.execute(query, [id]);

    if (result.length == 0) {
      return HttpResponse.notFound(res, "Nenhum pedido foi encontrado com esse ID");
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

      return HttpResponse.deleted(res, response);

    } catch (error) {
      return HttpResponse.serverError(res);
    }
  }
}

module.exports = new DemandController();