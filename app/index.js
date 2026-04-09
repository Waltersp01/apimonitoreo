const express = require("express");
const client = require("prom-client");

const app = express();
client.collectDefaultMetrics();

const counter = new client.Counter({
  name: "http_requests_total",
  help: "Total de peticiones",
});

app.get("/", (req, res) => {
  counter.inc();
  res.send("Hola mundo 🚀");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => console.log("API en puerto 3000"));