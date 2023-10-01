const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const logger = require('../Log/Logger.js');

var jwtSecret = "mysecrettoken";

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation error while registering user: ' + JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }

  const { Fullname, email, password, userRole, pNumber } = req.body;

  if (!Fullname || !email || !password) {
    logger.error('Missing required fields while registering user');
    return res.status(400).json({ errorMessage: "Name, email, and password fields are required." });
  }

  if (Fullname.length < 3) {
    logger.error('Invalid Fullname length while registering user');
    return res.status(400).json({ errorMessage: "Name field is required (Min 3 characters)." });
  }

  if (password.length < 7) {
    logger.error('Invalid password length while registering user');
    return res.status(400).json({ errorMessage: "Password field is required (Min 7 characters)." });
  }

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (user) {
      logger.error('User already exists while registering user');
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      Fullname,
      pNumber,
      email,
      password,
      userRole,
    });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        logger.error('Error while generating JWT token: ' + err.message);
        throw err;
      }
      logger.info('User registered successfully');
      res.json({ token, userRole: user.userRole, user: user.Fullname });
    });
  } catch (err) {
    logger.error('Error while registering user: ' + err.message);
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


const authUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.error('User not found while authenticating');
      return res.status(404).json({ message: "User not found" });
    }
    logger.info('User authenticated successfully');
    res.json(user);
  } catch (err) {
    logger.error('Error while authenticating user: ' + err.message);
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Invalid credentials during login');
    return res.status(400).json([{ msg: "Invalid Credentials" }]);
  }

  const { email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (!user) {
      logger.error('Invalid credentials during login');
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.error('Invalid credentials during login');
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1 days" }, (err, token) => {
      if (err) {
        logger.error('Error while generating JWT token during login: ' + err.message);
        throw err;
      }
      logger.info('User logged in successfully');
      res.json({ token, user: user.name, userRole: user.userRole });
    });
  } catch (err) {
    logger.error('Error while logging in user: ' + err.message);
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    logger.info('Fetched all users successfully');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error while fetching users: ' + error.message);
    res.status(404).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      logger.error(`User with id ${id} not found`);
      return res.status(404).json({ message: `User with id ${id} not found` });
    }

    logger.info(`Fetched user with id ${id} successfully`);
    res.status(200).json(user);
  } catch (error) {
    logger.error('Error while fetching user: ' + error.message);
    res.status(404).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { Fullname, email, password, userRole, pNumber } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    if (user) {
      logger.error('User already exists during user creation');
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({
      Fullname,
      pNumber,
      email,
      password,
      userRole,
    });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    logger.info('User created successfully');
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error while creating user: ' + error.message);
    res.status(409).json({ message: error.message });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { Fullname, email, password, userRole, pNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error(`Invalid user ID provided: ${id}`);
    return res.status(404).send(`No user with id: ${id}`);
  }

  const updatedUser = {
    Fullname,
    pNumber,
    email,
    password,
    userRole,
    _id: id,
  };

  try {
    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
      logger.error(`User with id ${id} not found during update`);
      return res.status(404).json({ message: `User with id ${id} not found` });
    }

    logger.info(`User with id ${id} updated successfully`);
    res.json(updatedUser);
  } catch (error) {
    logger.error(`Error while updating user with id ${id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error(`Invalid user ID provided: ${id}`);
    return res.status(404).send(`No user with id: ${id}`);
  }

  try {
    const user = await User.findByIdAndRemove(id);

    if (!user) {
      logger.error(`User with id ${id} not found during deletion`);
      return res.status(404).json({ message: `User with id ${id} not found` });
    }

    logger.info(`User with id ${id} deleted successfully`);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    logger.error(`Error while deleting user with id ${id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getUsersByID = async (req, res) => {
  let id = req.params;
  console.log("id", id.id);

  try {
    const users = await User.findOne({ Fullname: id.id });

    if (!users) {
      logger.error(`User with Fullname ${id.id} not found`);
      return res.status(404).json({ message: `User with Fullname ${id.id} not found` });
    }

    logger.info(`Fetched user with Fullname ${id.id} successfully`);
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error while fetching user by Fullname: ' + error.message);
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  registerUser,
  authUser,
  loginUser,
  getUsersByID,
};
