const Product = require("../models/product");
const { v4: uuidv4 } = require("uuid");

exports.addNewProduct = async (req, res) => {
  const product = req.body;
  try {
    const newProduct = new Product({
      id: uuidv4(),
      images: product.image,
      name: product.itemName,
      price: product.price,
      discountedPrice: product.discountedPrice,
      skuID: product.skuId,
      variant: {
        material: product.material,
        color: product.color,
      },
      category: product.category,
      description: product.description,
      weight: product.weight,
      available: true,
      stock: product.stock,
      rating: {
        rate: 0,
        count: 0,
      },
      mostLoved: false,
    });
    await newProduct.save();

    // Emit the new product to all clients
    const io = req.app.get("socketio");
    io.emit("productAdded", newProduct);

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.available = !product.available;

    await product.save();

    // Emit the product availability toggled event to all clients
    const io = req.app.get("socketio");
    io.emit("productToggled", product);

    return res
      .status(200)
      .json({ message: "Product availability updated", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    res
      .status(200)
      .json({ message: "Get product details successfully", data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const product = req.body;

    if (!product || !product._id) {
      return res
        .status(400)
        .json({ message: "Product ID and update data are required." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $set: {
          name: product.itemName,
          price: product.price,
          discountedPrice: product.discountedPrice,
          skuID: product.skuId,
          variant: {
            material: product.variant?.material || product.material,
            color: product.variant?.color || product.color,
          },
          category: product.category,
          description: product.description,
          weight: product.weight,
          stock: product.stock,
          images: product.images
            ? product.images.map((url) => ({ url }))
            : undefined,
          mostLoved: product.mostLoved,
          available: product.available,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Emit the product updated event to all clients
    const io = req.app.get("socketio");
    io.emit("productUpdated", updatedProduct);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    await Product.findByIdAndDelete(productId);

    // Emit the product deleted event to all clients
    const io = req.app.get("socketio");
    io.emit("productDeleted", productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error Deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

