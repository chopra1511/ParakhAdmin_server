const express = require('express');
const { getOrders, getOrderDetails, updateTracking } = require('../controller/OrdersController');
const router = express.Router();

router.get("/get-orders", getOrders);

router.post("/order-details", getOrderDetails);

router.post("/order-tracking", updateTracking);

exports.routes = router;