class ProductController {
  index(req, res) {
    res.status(200).send({
      message: "Busca concluída com sucesso"
    });
  }

  store(req, res) {
    const product = {
      name: req.body.name,
      price: req.body.price
    }

    res.status(201).json({
      message: "Produto criado com sucesso",
      product: product
    });
  }

  show(req, res) {
    const id = req.params.id;

    res.status(200).send({
      message: "Produto encontrado",
      id: parseInt(id)
    });
  }
}

module.exports = new ProductController();