const db = require("../config/db");
const { generateUserToken } = require("../config/userToken");
const bcrypt = require("bcrypt");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM green_user");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Users found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Users",
      totalUsers: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Users",
      error,
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(`SELECT * FROM green_user WHERE email=?`, [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const user = results[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(user?.password, hashedPassword);

    if (!isMatch) {
      return res.status(403).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const token = generateUserToken(user);
    const { password: pwd, ...userWithoutPassword } = user;
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      message: "User Login Unseccess",
      error: error.message,
    });
  }
};

// user get me
const getMeUser = async (req, res) => {
  try {
    const decodeduser = req?.decodeduser?.email;
    const result = await db.query(`SELECT * FROM green_user WHERE email=?`, [
      decodeduser,
    ]);

    const user = result[0];
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get user by id
const getUserByID = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide user id",
      });
    }
    const data = await db.query(`SELECT * FROM green_user WHERE id=?`, [
      userID,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No user found",
      });
    }
    const user = data[0];
    res.status(200).send(user[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get User",
      error,
    });
  }
};

// create user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const status = "Panding";

    const query = `
    INSERT INTO green_user (name, email, password, phone, status) 
    VALUES (?, ?, ?, ?, ?)
  `;
    const data = await db.query(query, [name, email, password, phone, status]);

    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "User create Successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create User API",
      error,
    });
  }
};

// user password update
const updateUserPassword = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide user id",
      });
    }
    const { password } = req.body;
    const data = await db.query(
      `UPDATE green_user SET password=? WHERE id = ?`,
      [password, userID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in password update user",
      });
    }
    res.status(200).send({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password Update User",
      error: error.message,
    });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide user id",
      });
    }
    const { name, phone, block, road, house } = req.body;
    const profilePic = "jpg";
    const data = await db.query(
      `UPDATE green_user SET name=?, profilePic=?, phone=?, block=?, road=?, house=? WHERE id = ?`,
      [name, profilePic, phone, block, road, house, userID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update user",
      });
    }
    res.status(200).send({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update User",
      error: error.message,
    });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide user id",
      });
    }

    await db.query(`DELETE FROM green_user WHERE id=?`, [userID]);
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete User",
      error,
    });
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  getMeUser,
  getUserByID,
  createUser,
  updateUserPassword,
  updateUser,
  deleteUser,
};
