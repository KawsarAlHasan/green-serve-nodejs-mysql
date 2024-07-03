const express = require("express");
const uploadImage = require("../middleware/uploaderImage");
const {
  loginAdmin,
  adminUpdate,
  adminPasswordUpdate,
  getMeAdmin,
} = require("../controllers/adminController");
const varifyAdminToken = require("../middleware/varifyAdminToken");

const router = express.Router();

router.post("/login", loginAdmin);
router.put("/password/:id", varifyAdminToken, adminPasswordUpdate);
router.put(
  "/:id",
  varifyAdminToken,
  uploadImage.single("profilePic"),
  adminUpdate
);
router.get("/me", varifyAdminToken, getMeAdmin);

module.exports = router;
