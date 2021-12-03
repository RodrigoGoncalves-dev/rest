const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const routeProduct = require("./routes/products");
const routeDemand = require("./routes/demands");
const bodyParser = require("body-parser");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors("*"));

app.use("/products", routeProduct);
app.use("/demands", routeDemand);

app.use((req, res, next) => {
  const erro = new Error("Não encontrada");
  erro.status = 404;
  next(erro);
});

module.exports = app;