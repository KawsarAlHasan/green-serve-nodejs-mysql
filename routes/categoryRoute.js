const express = require("express");

const uploadImage = require("../middleware/uploaderImage");
const {
  getAllCategory,
  getCategoryByID,
  createcategory,
  updatecategory,
  deletecategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/all", getAllCategory); // get all category
router.get("/:id", getCategoryByID); // get category by id
router.post(
  "/create",
  uploadImage.fields([{ name: "images", maxCount: 1 }]),
  createcategory
); // create category
router.put("/update/:id", updatecategory); // update category
router.delete("/delete/:id", deletecategory); // delete category

module.exports = router;
