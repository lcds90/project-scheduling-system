const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const APPOINTMENT_SERVICE = require("./services/AppointmentService");

// ====================================================

/* Live Reload Config */
const path = require("path");
const publicDirectory = path.join(__dirname, "public");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const AppointmentService = require("./services/AppointmentService");
const liveReloadServer = livereload.createServer();

// ----------------------------------------------------

liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLivereload());

// ====================================================

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "pug");

mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cadastro", (req, res) => {
  res.render("create");
});

app.get("/event/:id", async (req, res) => {
  let appointment = await AppointmentService.GetById(req.params.id);

  // console.log(appointment);
  if (appointment != undefined) {
    res.render("appointment", { appo: appointment });
  } else {
    res.redirect("/");
  }
});

app.post("/create", async (req, res) => {
  let status = await APPOINTMENT_SERVICE.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time
  );

  if (status) {
    res.redirect("/");
  } else {
    res.send("Ocorreu alguma falha");
  }
});

app.post("/finish", async (req, res) => {
  let id = req.body.id;
  let result = await APPOINTMENT_SERVICE.Finish(id);

  if (result) {
    res.redirect("/");
  } else {
    res.redirect("/");
    console.log("Erro!");
  }
});

app.get("/appointments", async (req, res) => {
  let appointments = await AppointmentService.GetAll(false);
  res.json(appointments);
});

app.get("/list", async (req, res) => {
  let appointments = await AppointmentService.GetAll(true);
  res.render("list", { appos: appointments });
});

app.get("/search/", async (req, res) => {
  let appointments = await AppointmentService.Search(req.query.query);
  res.render("list", { appos: appointments });
});

var pulltime = 1000 * 60 * 5;

setInterval( async ()=> {
  await AppointmentService.sendNotification();
}, pulltime)

app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});
