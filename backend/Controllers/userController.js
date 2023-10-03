const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const logger = require('../Log/Logger.js');

// Use environment variable for JWT secret key
const jwtSecret = process.env.JWT_SECRET || "mysecrettoken";


const userController = {

  // Register a new user
   registerUser: async (req, res) => {
    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Fullname, email, password, userRole, pNumber } = req.body;

    if (!Fullname || !email || !password) {
      return res.status(400).json({
        errorMessage: "Name, email, and password fields are required..!",
      });
    }

    if (Fullname.length < 3) {
      return res.status(400).json({
        errorMessage: "Name field is required..! (Min 3 characters)",
      });
    }

    if (password.length < 7) {
      return res.status(400).json({
        errorMessage: "Password field is required..! (Min 7 characters)",
      });
    }

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
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
          logger.error(`Error signing JWT: ${err.message}`);
          throw err;
        }

        logger.info(`User registered: ${user.Fullname}`);
        res.json({ token, userRole: user.userRole, user: user.Fullname });
      });
    } catch (err) {
      logger.error(`Error during user registration: ${err.message}`);
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },

  // Create a user
  createUser: async (req, res) => {
    const { Fullname, email, password, userRole, pNumber } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
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

      res.status(201).json(user);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },

  // Log in a user
  loginUser: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json([{ msg: "Invalid Credentials" }]);
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        logger.warn(`Login attempt failed for email: ${email} (User not found)`);
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        logger.warn(`Login attempt failed for email: ${email} (Invalid password)`);
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "1 day" }, (err, token) => {
        if (err) {
          logger.error(`Error signing JWT for email: ${email} - ${err.message}`);
          throw err;
        }
        logger.info(`User logged in: ${user.Fullname}`);
        res.json({ token, user: user.Fullname, userRole: user.userRole });
      });

     } catch (err) {
      logger.error(`Error during user login for email: ${email} - ${err.message}`);
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },

  // Authenticate a user
  authUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        logger.warn(`User with ID ${req.user.id} not found`);
        return res.status(404).json({ message: "User not found" });
      }

      logger.info(`User authenticated: ${user.Fullname}`);
      res.json(user);
    } catch (err) {
      logger.error(`Error during user authentication: ${err.message}`);
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },


  // Get all users
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      logger.info(`Retrieved ${users.length} users from the database`);
      res.status(200).json(users);
    } catch (error) {
      logger.error(`Error while fetching users: ${error.message}`);
      res.status(404).json({ message: error.message });
    }
  },

  // Get user by ID
  getUserByID: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        logger.error(`User not found for ID: ${id}`);
        return res.status(404).json({ message: "User not found" });
      }
      logger.info(`User retrieved successfully for ID: ${id}`);
      res.status(200).json(user);
    } catch (error) {
      logger.error(`Error while fetching user by ID: ${error.message}`);
      res.status(404).json({ message: error.message });
    }
  },

  // Update a user by ID
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { Fullname, email, password, userRole, pNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No user with id: ${id}` });
    }

    const updatedUser = {
      Fullname,
      pNumber,
      email,
      password,
      userRole,
      _id: id,
    };

    await User.findByIdAndUpdate(id, updatedUser, { new: true });

    res.json(updatedUser);
  },

  // Delete a user by ID
  deleteUser: async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`Invalid user ID provided: ${id}`);
      return res.status(404).json({ message: `No user with id: ${id}` });
    }
    await User.findByIdAndRemove(id);
    res.json({ message: "User deleted successfully." });
  },

  // Get user by Fullname
  getUsersByName: async (req, res) => {
    let id = req.params;
    console.log("id", id.id);

    try {
      const user = await User.findOne({ Fullname: id.id });

      if (!user) {
        console.log(`User not found for Fullname: ${id.id}`);
        return res.status(404).json({ message: "User not found" });
      }

      console.log(`User found for Fullname: ${id.id}`);
      res.status(200).json(user);
    } catch (error) {
      console.error(`Error while fetching user by Fullname: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;