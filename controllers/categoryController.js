const db = require("../config/db");

// get all category
const getAllCategory = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM green_category");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No category found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All category",
      totalcategory: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All category",
      error,
    });
  }
};

// get category by id
const getCategoryByID = async (req, res) => {
  try {
    const categoryID = req.params.id;
    if (!categoryID) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide category id",
      });
    }
    const data = await db.query(`SELECT * FROM green_category WHERE id=?`, [
      categoryID,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No category  found",
      });
    }
    const category = data[0];
    res.status(200).send(category[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get category",
      error,
    });
  }
};

// create create category
const createcategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(500).send({
        success: false,
        message: "Please provide name fields",
      });
    }

    const images = req.files["images"]
      ? req.files["images"].map((file) => file.path).join(",")
      : "";

    if (!images) {
      return res.status(500).send({
        success: false,
        message: "Please provide images fields",
      });
    }

    const data = await db.query(
      `INSERT INTO green_category (
          name,
          images
        ) VALUES (?, ?)`,
      [name, images]
    );

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category created successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create category API",
      error: error.message,
    });
  }
};

// update category
const updatecategory = async (req, res, next) => {
  try {
    const categoryID = req.params.id;
    if (!categoryID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide category id",
      });
    }
    const { name } = req.body;

    if (!name) {
      return res.status(500).send({
        success: false,
        message: "Please provide  name fields",
      });
    }

    const query = `UPDATE green_category SET name = ?  WHERE id = ?`;
    const data = await db.query(query, [name, categoryID]);

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in UPDATE QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update category API",
      error: error.message,
    });
  }
};

// delete category
const deletecategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    if (!categoryID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide category id",
      });
    }

    await db.query(`DELETE FROM green_category WHERE id=?`, [categoryID]);
    res.status(200).send({
      success: true,
      message: "category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete category",
      error,
    });
  }
};

module.exports = {
  getAllCategory,
  getCategoryByID,
  createcategory,
  updatecategory,
  deletecategory,
};
