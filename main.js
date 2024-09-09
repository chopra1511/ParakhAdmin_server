const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

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
  .connect(
    "mongodb+srv://rahul:rahul1511@parakh.uygnadp.mongodb.net/parakh?retryWrites=true&w=majority&appName=Parakh"
  )
  .then(() => {
    server.listen(3000, () => {
      console.log(`Connected! and running on port ${3000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Pass io instance to be used in controllers
app.set("socketio", io);
