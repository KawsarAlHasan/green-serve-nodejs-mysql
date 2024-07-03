const express = require("express");
const uploadImage = require("../middleware/uploaderImage");
const {
  getAllSubCategory,
  getSubCategoryByID,
  createSubcategory,
  updateSubCategory,
  deleteSubcategory,
} = require("../controllers/subCategoryController");

const router = express.Router();

router.get("/all", getAllSubCategory); // get all subcategory
router.get("/:id", getSubCategoryByID); // get subcategory by id
router.post(
  "/create",
  uploadImage.fields([{ name: "images", maxCount: 1 }]),
  createSubcategory
); // create subcategory
router.put("/update/:id", updateSubCategory); // update subcategory
router.delete("/delete/:id", deleteSubcategory); // delete subcategory

module.exports = router;
