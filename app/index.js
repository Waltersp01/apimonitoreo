const express = require("express");
const client = require("prom-client");

const app = express();

app.use(express.json());


client.collectDefaultMetrics();


const counter = new client.Counter({
  name: "http_requests_total",
  help: "Total de peticiones HTTP",
  labelNames: ["method", "route"]
});


const httpDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duración de peticiones en ms",
  buckets: [50, 100, 300, 500, 1000, 3000]
});


app.use((req, res, next) => {
  const start = Date.now();

 
  counter.labels(req.method, req.path).inc();


  res.on("finish", () => {
    const duration = Date.now() - start;
    httpDuration.observe(duration);
  });

  next();
});



app.get("/", (req, res) => {
  res.send("API REST con Prometheus ");
});


app.get("/usuarios", (req, res) => {
  res.json([
    { id: 1, nombre: "Juan" },
    { id: 2, nombre: "Ana" }
  ]);
});


app.get("/productos", (req, res) => {
  res.json([
    { id: 1, nombre: "Laptop" },
    { id: 2, nombre: "Mouse" }
  ]);
});


app.post("/usuarios", (req, res) => {
  const usuario = req.body;
  res.status(201).json({
    mensaje: "Usuario creado",
    data: usuario
  });
});


app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});