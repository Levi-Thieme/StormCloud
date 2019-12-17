const express = require("express");
const app = express();
const path = require("path");
const routes = require(path.join(__dirname, "app/routes.js"));
app.use(express.static(path.join(__dirname, "views")));
app.use(routes);
app.listen(process.env.port || 80);