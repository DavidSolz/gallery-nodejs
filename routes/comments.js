const authenticate = require("../middleware/authenticate");
var express = require('express');
var router = express.Router();

const commentController = require("../controllers/commentController");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - image
 *         - gallery
 *         - author
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the comment
 *         image:
 *           type: string
 *           format: ObjectId
 *           description: Reference to the image
 *         gallery:
 *           type: string
 *           format: ObjectId
 *           description: Reference to the gallery
 *         author:
 *           type: string
 *           description: Name of the comment author
 *         content:
 *           type: string
 *           maxLength: 250
 *           description: Comment content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the comment was created
 */

/**
 * @swagger
 * /comments/comment_add/{image_id}:
 *   post:
 *     summary: Add a new comment to an image
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: ID of the image to comment on
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - galleryId
 *               - author
 *               - content
 *             properties:
 *               galleryId:
 *                 type: string
 *               author:
 *                 type: string
 *               content:
 *                 type: string
 *                 example: "Great photo!"
 *     responses:
 *       302:
 *         description: Redirects to the image page after successful comment
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/comment_add/:image_id", authenticate, commentController.commentAddPost);

/**
 * @swagger
 * /comments/comment_delete/{comment_id}:
 *   post:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to image page after deletion
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post('/comment_delete/:comment_id', authenticate, commentController.commentDeletePost)

/**
 * @swagger
 * /comments/comment_edit/{comment_id}:
 *   get:
 *     summary: Render the edit comment form
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         description: ID of the comment to edit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendered edit form
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Error loading comment
 */
router.get("/comment_edit/:comment_id", authenticate, commentController.commentEditGet);

/**
 * @swagger
 * /comments/comment_edit/{comment_id}:
 *   post:
 *     summary: Submit changes to a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       302:
 *         description: Redirects to image page after update
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Error updating comment
 */
router.post("/comment_edit/:comment_id", authenticate, commentController.commentEditPost);

module.exports = router;
