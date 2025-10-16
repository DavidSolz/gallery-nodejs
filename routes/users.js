var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate")
const authorize = require("../middleware/authorize")

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated user ID
 *         username:
 *           type: string
 *           maxLength: 100
 *           description: Unique username
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: User's first name
 *         surname:
 *           type: string
 *           maxLength: 100
 *           description: User's surname
 *         password:
 *           type: string
 *           description: Hashed password
 */


/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users rendered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, authorize, userController.userList);

/**
 * @swagger
 * /users/user_add:
 *   get:
 *     summary: Render form to add a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form rendered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/user_add", authenticate, authorize, userController.userAddGet);

/**
 * @swagger
 * /users/user_add:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, surname, username, password]
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added or validation error
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/user_add", authenticate, authorize, userController.userAddPost);

/**
 * @swagger
 * /users/user_login:
 *   get:
 *     summary: Render login form
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Form rendered
 */
router.get("/user_login", userController.userLoginGet);

/**
 * @swagger
 * /users/user_login:
 *   post:
 *     summary: Authenticate and login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect after successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/user_login", userController.userLoginPost);

/**
 * @swagger
 * /users/user_logout:
 *   get:
 *     summary: Log out current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */
router.get("/user_logout", authenticate, userController.userLogoutGet);

/**
 * @swagger
 * /users/user_delete/{user_id}:
 *   post:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect after deletion
 *       400:
 *         description: Cannot delete self
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/user_delete/:user_id", authenticate, authorize, userController.userDeletePost);

module.exports = router;
