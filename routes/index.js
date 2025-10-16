var express = require('express');
var router = express.Router();

const authenticate = require("../middleware/authenticate")

/**
 * @swagger
 * /:
 *   get:
 *     summary: Render homepage
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rendered homepage with title
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, function(req, res, next) {
  res.render('index', {
    title: 'Gallery App'
  });
});

module.exports = router;
