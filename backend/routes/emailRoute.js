const router = require("express").Router()
const emailController = require("../src/controllers/emailController")
/**
 * @openapi
 * /api/emails/all:
 *   post:
 *     tags:
 *       - Email
 *     summary: Send email to all users
 *     description: Send email to entire users of a system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully email sent.
 *       400:
 *         description: Validation errors or incorrect data.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/all",
    emailController.sendEmailToAllUsers
);
module.exports = router;
