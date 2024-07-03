const db = require("../config/db");

// get all Subcategory
const getAllSubCategory = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM subcategory");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No subcategory found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All subcategory",
      totalsubcategory: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All subcategory",
      error: error.message,
    });
  }
};

// get single subcategory
const getSubCategoryByID = async (req, res) => {
  try {
    const subcategoryID = req.params.id;
    if (!subcategoryID) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide subcategory id",
      });
    }
    const data = await db.query(`SELECT * FROM subcategory WHERE id=?`, [
      subcategoryID,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No subcategory found",
      });
    }
    const subcategory = data[0];
    res.status(200).send(subcategory[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get subcategory",
      error,
    });
  }
};

// create subcategory
const createSubcategory = async (req, res, next) => {
  try {
    const { subcategory, category } = req.body;

    if (!subcategory || !category) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
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
      `INSERT INTO subcategory (
            subcategory,
            images,
            category
          ) VALUES (?, ?, ?)`,
      [subcategory, images, category]
    );

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "subcategory created successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create subcategory API",
      error: error.message,
    });
  }
};

// update subcategory
const updateSubCategory = async (req, res, next) => {
  try {
    const subCategoryID = req.params.id;
    if (!subCategoryID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide subcategory id",
      });
    }
    const { subcategory, images, category } = req.body;

    if (!subcategory || !images || !category) {
      return res.status(500).send({
        success: false,
        message: "Please provide All fields",
      });
    }

    const query = `UPDATE subcategory SET subcategory = ?, images = ?, category = ?  WHERE id = ?`;
    const data = await db.query(query, [
      subcategory,
      images,
      category,
      subCategoryID,
    ]);

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in UPDATE QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "SubCategory updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update SubCategory API",
      error: error.message,
    });
  }
};

// delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;
    if (!subCategoryId) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide subcategory id",
      });
    }

    await db.query(`DELETE FROM subcategory WHERE id=?`, [subCategoryId]);
    res.status(200).send({
      success: true,
      message: "subcategory Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete subcategory",
      error,
    });
  }
};

module.exports = {
  getAllSubCategory,
  getSubCategoryByID,
  createSubcategory,
  updateSubCategory,
  deleteSubcategory,
};
