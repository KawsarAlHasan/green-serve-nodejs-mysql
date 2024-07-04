const { generateAdminToken } = require("../config/adminToken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(
      `SELECT * FROM green_admin WHERE email=?`,
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const admin = results[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(admin?.password, hashedPassword);

    if (!isMatch) {
      return res.status(403).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const token = generateAdminToken(admin);
    const { password: pwd, ...adminWithoutPassword } = admin;
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        admin: adminWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      message: "Admin Login Unseccess",
      error: error.message,
    });
  }
};

// admin name and profilepic update
const adminUpdate = async (req, res) => {
  try {
    const adminID = req.params.id;
    if (!adminID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide admin id",
      });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide name fields",
      });
    }

    // const profilePic = req.file.path;
    const profilePic = req.file.path.replace("public/", "");

    const data = await db.query(
      `UPDATE green_admin SET name=?, profilePic=? WHERE id =? `,
      [name, profilePic, adminID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update admin",
      });
    }
    res.status(200).send({
      success: true,
      message: "admin updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update admin",
      error,
    });
  }
};

// admin password update
const adminPasswordUpdate = async (req, res) => {
  try {
    const adminID = req.params.id;
    if (!adminID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide admin id",
      });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide Password",
      });
    }

    const data = await db.query(
      `UPDATE green_admin SET password=? WHERE id =? `,
      [password, adminID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update admin",
      });
    }
    res.status(200).send({
      success: true,
      message: "Admin Password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update admin",
      error,
    });
  }
};

// get me admin
const getMeAdmin = async (req, res) => {
  try {
    const decodedadmin = req?.decodedadmin?.email;
    const result = await db.query(`SELECT * FROM green_admin WHERE email=?`, [
      decodedadmin,
    ]);

    res.status(200).json({
      success: true,
      admin: result[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  adminUpdate,
  adminPasswordUpdate,
  getMeAdmin,
};
