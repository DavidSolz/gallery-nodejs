var express = require('express');
var router = express.Router();

const statsController = require("../controllers/statsController");
const authenticate = require("../middleware/authenticate")

/**
 * @swagger
 * /stats/:
 *   get:
 *     summary: Get global statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application statistics including total users, galleries, and images
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, statsController.statsList);

module.exports = router;
