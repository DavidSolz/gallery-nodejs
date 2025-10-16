const authenticate = require("../middleware/authenticate");
var express = require('express');
var router = express.Router();

const galleryController = require("../controllers/galleryController");

/**
 * @swagger
 * tags:
 *   name: Galleries
 *   description: Gallery management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gallery:
 *       type: object
 *       required:
 *         - name
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the gallery
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Gallery name
 *         description:
 *           type: string
 *           maxLength: 200
 *           description: Optional gallery description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         user:
 *           type: string
 *           format: ObjectId
 *           description: Reference to the user who owns the gallery
 */

 /**
  * @swagger
  * /galleries/:
  *   get:
  *     summary: Get list of user galleries
  *     tags: [Galleries]
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: List of galleries for logged-in user
  *       401:
  *         description: Unauthorized
  */
router.get("/", authenticate, galleryController.galleryList);

/**
 * @swagger
 * /galleries/gallery_add:
 *   get:
 *     summary: Render form to add a new gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gallery add form rendered
 *       401:
 *         description: Unauthorized
 */
router.get("/gallery_add", authenticate, galleryController.galleryAddGet);

/**
 * @swagger
 * /galleries/gallery_add:
 *   post:
 *     summary: Add a new gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - user
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gallery added or validation errors
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate gallery
 */
router.post("/gallery_add", authenticate, galleryController.galleryAddPost);

/**
 * @swagger
 * /galleries/gallery_browse:
 *   get:
 *     summary: Render gallery browse form
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rendered form to select a gallery to browse
 */
router.get("/gallery_browse", authenticate, galleryController.galleryBrowseGet);

/**
 * @swagger
 * /galleries/gallery_browse:
 *   post:
 *     summary: Display images from selected gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               s_gallery:
 *                 type: string
 *                 description: Selected gallery ID
 *     responses:
 *       200:
 *         description: Images displayed from selected gallery
 */
router.post("/gallery_browse", authenticate, galleryController.galleryBrowsePost);

/**
 * @swagger
 * /galleries/gallery_delete/{gallery_id}:
 *   post:
 *     summary: Delete a gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gallery_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery to delete
 *     responses:
 *       200:
 *         description: Gallery deleted or appropriate error rendered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gallery not found
 *       409:
 *         description: Gallery not empty
 */
router.post("/gallery_delete/:gallery_id", authenticate, galleryController.galleryDeletePost);

/**
 * @swagger
 * /galleries/gallery_update/{gallery_id}:
 *   get:
 *     summary: Render form to update a gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gallery_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery to update
 *     responses:
 *       200:
 *         description: Gallery edit form rendered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gallery not found
 */
router.get("/gallery_update/:gallery_id", authenticate, galleryController.galleryUpdateGet);

/**
 * @swagger
 * /galleries/gallery_update/{gallery_id}:
 *   post:
 *     summary: Update a gallery
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gallery_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the gallery to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               user:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect on success
 *       400:
 *         description: Validation or update error
 *       404:
 *         description: Gallery not found
 *       409:
 *         description: Duplicate gallery name for user
 */
router.post("/gallery_update/:gallery_id", authenticate, galleryController.galleryUpdatePost);


module.exports = router;
