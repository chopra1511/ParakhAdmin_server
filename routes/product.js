const express = require('express');
const { addNewProduct, getProducts, toggleAvailability, getProductDetails, editProduct, deleteProduct } = require('../controller/ProductController');
const router = express.Router();


router.post("/add-product", addNewProduct);

router.post("/edit-product", editProduct);

router.post("/delete-product", deleteProduct);

router.get("/get-products", getProducts);

router.post("/toggle-available", toggleAvailability);

router.post("/product-details", getProductDetails);


exports.routes = router;