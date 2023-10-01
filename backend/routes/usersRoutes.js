const router = require("express").Router();
const UserController = require("../controllers/userController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post("/users", UserController.createUser);
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserByID);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

// Route to register a new user
router.post(
  "/signup",
  [
    check("Fullname", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  UserController.registerUser
);

// Route to authenticate a user
router.post(
  "/signin",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  UserController.loginUser
);

// Protected route that requires authentication using the auth middleware
router.get("/auth", auth, (req, res) => {
  // The user information is available in req.user
  res.json({ message: "This route is protected", user: req.user });
});

module.exports = router;
