require("dotenv").config;
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "*" }));

app.use(productRoutes.routes);
app.use(orderRoutes.routes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Connected! and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Pass io instance to be used in controllers
app.set("socketio", io);
