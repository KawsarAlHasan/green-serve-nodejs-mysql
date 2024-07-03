const db = require("../config/db");

// get all products
const getAllProducts = async (req, res) => {
  try {
    let { name, category, subcategory, brand, status, sort, page, limit } =
      req.query;

    // Default values
    sort = sort || "id";
    category = category || "";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    if (!name) {
      name = name || "";
    }

    // Construct the main query
    let query = "SELECT * FROM green_products WHERE (name LIKE ? )";
    let params = [`%${name}%`];

    // Add category condition if provided
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (subcategory) {
      query += " AND subcategory = ?";
      params.push(subcategory);
    }

    if (brand) {
      query += " AND brand = ?";
      params.push(brand);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    // Add sort condition
    query += ` ORDER BY ${sort}`;

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute the main query
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No products found",
      });
    }

    // Construct the total count query
    let totalQuery =
      "SELECT COUNT(*) as count FROM green_products WHERE (name LIKE ?)";
    let totalParams = [`%${name}%`];

    if (category) {
      totalQuery += " AND category = ?";
      totalParams.push(category);
    }
    if (subcategory) {
      totalQuery += " AND subcategory = ?";
      totalParams.push(subcategory);
    }

    if (brand) {
      totalQuery += " AND brand = ?";
      totalParams.push(brand);
    }

    if (status) {
      totalQuery += " AND status = ?";
      totalParams.push(status);
    }

    // Execute the total count query
    const [[{ count }]] = await db.query(totalQuery, totalParams);

    res.status(200).send({
      success: true,
      message: "All products",
      totalProducts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All products",
      error: error.message,
    });
  }
};

// get Product by id
const getProductByID = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide product id",
      });
    }
    const data = await db.query(`SELECT * FROM green_products WHERE id=?`, [
      productId,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No product  found",
      });
    }
    const product = data[0];
    res.status(200).send(product[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get product",
      error,
    });
  }
};

// create create Product
const createProducts = async (req, res, next) => {
  try {
    const {
      name,
      price,
      productType,
      quantity,
      category,
      subcategory,
      brand,
      status,
    } = req.body;

    if (!name || !price) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const images = req.files["images"]
      ? req.files["images"].map((file) => file.path)
      : [];

    const data = await db.query(
      `INSERT INTO green_products (
          name,
          price,
          productType,
          quantity,
          category,
          subcategory,
          images,
          brand,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        productType,
        quantity,
        category,
        subcategory,
        images,
        brand,
        status,
      ]
    );

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create Products API",
      error: error.message,
    });
  }
};

// update product
const updateProducts = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!productID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide product id",
      });
    }
    const { name, price } = req.body;
    const data = await db.query(
      `UPDATE green_products SET name=?, price=? WHERE id =? `,
      [name, price, productID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update product ",
      });
    }
    res.status(200).send({
      success: true,
      message: "product  updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update product ",
      error,
    });
  }
};

// delete Product
const deleteProducts = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!productID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide product id",
      });
    }

    await db.query(`DELETE FROM green_products WHERE id=?`, [productID]);
    res.status(200).send({
      success: true,
      message: "product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete product",
      error,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductByID,
  createProducts,
  updateProducts,
  deleteProducts,
};
