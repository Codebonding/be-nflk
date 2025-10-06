const ProductService = require('../services/productService');
const { productSchema } = require('../validations/productValidation');

exports.createProduct = async (req, res) => {
  try {
    let bodyData = { ...req.body };

    // Convert numeric fields
    if (bodyData.buyingCost) bodyData.buyingCost = parseFloat(bodyData.buyingCost);
    if (bodyData.originalPrice) bodyData.originalPrice = parseFloat(bodyData.originalPrice);
    if (bodyData.offerPrice) bodyData.offerPrice = parseFloat(bodyData.offerPrice);
    if (bodyData.stock) bodyData.stock = parseInt(bodyData.stock);

    // Convert JSON fields
    if (bodyData.categories) {
      try {
        bodyData.categories = JSON.parse(bodyData.categories);
      } catch {
        bodyData.categories = [bodyData.categories];
      }
    }
    if (bodyData.specifications) {
      try {
        bodyData.specifications = JSON.parse(bodyData.specifications);
      } catch {
        bodyData.specifications = {};
      }
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file =>
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }
    bodyData.images = imageUrls;

    // Joi validation
    const { error } = productSchema.validate(bodyData);
    if (error)
      return res.status(400).json({ success: false, message: error.details[0].message });

    const product = await ProductService.createProduct(bodyData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
      category: req.query.category,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined
    };

    const products = await ProductService.getAllProducts(filters);
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET PRODUCT BY ID =================
exports.getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    let bodyData = { ...req.body };

    // Convert numeric fields
    if (bodyData.buyingCost) bodyData.buyingCost = parseFloat(bodyData.buyingCost);
    if (bodyData.originalPrice) bodyData.originalPrice = parseFloat(bodyData.originalPrice);
    if (bodyData.offerPrice) bodyData.offerPrice = parseFloat(bodyData.offerPrice);
    if (bodyData.stock) bodyData.stock = parseInt(bodyData.stock);

    // Convert JSON fields
    if (bodyData.categories) {
      try {
        bodyData.categories = JSON.parse(bodyData.categories);
      } catch {
        bodyData.categories = [bodyData.categories];
      }
    }
    if (bodyData.specifications) {
      try {
        bodyData.specifications = JSON.parse(bodyData.specifications);
      } catch {
        bodyData.specifications = {};
      }
    }

    // Handle images if new ones uploaded
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => 
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
      bodyData.images = imageUrls;
    }

    // Joi validation
    const { error } = productSchema.validate(bodyData);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const product = await ProductService.updateProduct(req.params.id, bodyData);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};
