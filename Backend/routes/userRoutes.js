const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware'); // Import authentication middleware
const { checkAdmin } = require('../middleware/adminMiddleware'); // Import admin check middleware

// Route to add a new user (accessible only by admin)
router.post('/add', checkAuth, checkAdmin, userController.addUser);

router.post('/add', userController.addUser);

// Route to edit an existing user (accessible by admin or user editing their own profile)
router.put('/edit/:userId', checkAuth, userController.editUser);

// Route to delete a user (accessible only by admin)
router.delete('/delete/:userId', checkAuth, checkAdmin, userController.deleteUser);

// Route for user login (accessible by everyone)
router.post('/login', userController.loginUser);

// Route to view the logged-in user's profile (accessible by authenticated user)
router.get('/viewprofile', checkAuth, userController.viewProfile);

// Route to view all users (accessible only by admin)
router.get('/viewuser', checkAuth, checkAdmin, userController.viewUsers);

module.exports = router;
