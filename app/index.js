const express = require("express");
const client = require("prom-client");

const app = express();

client.collectDefaultMetrics();

const counter = new client.Counter({
  name: "http_requests_total",
  help: "Total de peticiones",
  labelNames: ["route"]
});

// middleware correcto
app.use((req, res, next) => {
  counter.labels({ route: req.path }).inc();
  next();
});

app.get("/", (req, res) => {
  res.send("EXAMEN FINAL DEVOPS - WALTER SANTOS ");
});

app.get("/usuarios", (req, res) => {
  res.json([{ id: 1, nombre: "Walter" }]);
});

app.get("/productos", (req, res) => {
  res.json([{ id: 1, nombre: "Laptop" }]);
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => console.log("API en puerto 3000"));