const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth"); // Import the auth middleware
const { check } = require("express-validator");
const {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  registerUser,
  loginUser,
} = require("../controllers/userController");

var jwtSecret = "mysecrettoken"; // Replace with your actual JWT secret

// Route to create a user
router.post("/createUser", createUser);

// Route to get all users
router.get("/getAllUsers", getUsers);

// Route to get a user by ID
router.get("/getUserById/:id", getUser);

// Route to delete a user by ID
router.delete("/deleteUser/:id", deleteUser);

// Route to update a user by ID
router.put("/updateUserById/:id", updateUser);

// Route to register a new user
router.post(
  "/signup",
  [
    check("Fullname", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  registerUser
);

// Route to authenticate a user
router.post(
  "/signin",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

// Protected route that requires authentication using the auth middleware
router.get("/auth", auth, (req, res) => {
  // The user information is available in req.user
  res.json({ message: "This route is protected", user: req.user });
});

module.exports = router;
