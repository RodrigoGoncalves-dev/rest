class DemandController {
  index(req, res) {
    res.status(200).send({
      message: "Todos os pedidos realizados por você"
    });
  }

  store(req, res) {
    const demand = {
      id_product: req.body.id_product,
      amount: req.body.amount
    };

    res.status(201).json({
      message: "Um pedido foi criado com sucesso",
      demand: demand
    });
  }

  show(req, res) {
    const id = req.params.id;

    res.status(200).send({
      message: "Detalhe do pedido",
      id: parseInt(id)
    });
  }
}

module.exports = new DemandController();