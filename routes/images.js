var express = require('express');
var router = express.Router();

const image_controller = require("../controllers/imageController");
const authenticate = require("../middleware/authenticate")

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Image management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - name
 *         - gallery
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the image
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the image
 *         description:
 *           type: string
 *           maxLength: 200
 *           description: Description of the image
 *         path:
 *           type: string
 *           maxLength: 200
 *           description: File path of the image
 *         gallery:
 *           type: string
 *           format: ObjectId
 *           description: Reference to the gallery the image belongs to
 */


/**
 * @swagger
 * /images/:
 *   get:
 *     summary: Get a list of all images
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, image_controller.imageList);

/**
 * @swagger
 * /images/image_add:
 *   get:
 *     summary: Render form to add a new image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form rendered
 *       401:
 *         description: Unauthorized
 */
router.get("/image_add", authenticate, image_controller.imageAddGet);

/**
 * @swagger
 * /images/image_add:
 *   post:
 *     summary: Add a new image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, description, path, gallery]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               path:
 *                 type: string
 *               gallery:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image added or validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/image_add", authenticate, image_controller.imageAddPost);

/**
 * @swagger
 * /images/image_upload:
 *   get:
 *     summary: Render image upload form
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form rendered
 *       401:
 *         description: Unauthorized
 */
router.get("/image_upload", authenticate, image_controller.imageUploadGet);

/**
 * @swagger
 * /images/image_upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload result
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
router.post("/image_upload", authenticate, image_controller.imageUploadPost);

/**
 * @swagger
 * /images/image_update:
 *   get:
 *     summary: Render update form for an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: image_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Update form rendered
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Image not found
 */
router.get("/image_update", authenticate, image_controller.imageUpdateGet);

/**
 * @swagger
 * /images/image_update:
 *   post:
 *     summary: Update an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: image_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               gallery:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect after update
 *       404:
 *         description: Image not found
 */
router.post("/image_update", authenticate, image_controller.imageUpdatePost);

/**
 * @swagger
 * /images/image_show:
 *   get:
 *     summary: Show image with comments
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: image_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendered image details
 *       404:
 *         description: Image not found
 */
router.get("/image_show", authenticate, image_controller.imageShow);

/**
 * @swagger
 * /images/image_delete/{image_id}:
 *   post:
 *     summary: Delete an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: image_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect after deletion
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Image not found
 */
router.post("/image_delete/:image_id", authenticate, image_controller.imageDelete);

module.exports = router;
