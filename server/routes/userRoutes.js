// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Register new user
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser)

router.get('/validate-session', userController.validateSession);


module.exports = router;
