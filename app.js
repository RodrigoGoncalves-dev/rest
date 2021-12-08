const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const routeProduct = require("./routes/products");
const routeDemand = require("./routes/demands");
const routeUser = require("./routes/users");
const routeClient = require("./routes/clients");

const bodyParser = require("body-parser");

app.use(cors("*"));
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/products", routeProduct);
app.use("/demands", routeDemand);
app.use("/users", routeUser);
app.use("/clients", routeClient);

app.use((req, res, next) => {
  const erro = new Error("Não encontrada");
  erro.status = 404;
  next(erro);
});

module.exports = app;