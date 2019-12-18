require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const routes = require(path.join(__dirname, "app/routes.js"));

mongoose.connect("mongodb://127.0.0.1/StormCloud", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error."));

app.use(express.static(path.join(__dirname, "views")));
app.use(routes);
app.listen(process.env.port || 80);