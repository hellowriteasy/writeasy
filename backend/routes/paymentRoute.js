const express = require("express");
const PaymentController = require("../src/controllers/paymentController");
const router = express.Router();

/**
 * @openapi
 * /api/payments/checkout:
 *   post:
 *     tags:
 *       - Stripe checkout
 *     summary: Create a checkout session
 *     description: Creates a checkout session and provides URLs for checkout, success, and failure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user
 *     responses:
 *       201:
 *         description: Checkout URL, success URL, and failure URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 success_url:
 *                   type: string
 *                 failure_url:
 *                   type: string
 *       400:
 *         description: Validation errors or incorrect data
 *       500:
 *         description: Internal server error
 */

router.post("/checkout", PaymentController.createStripeCheckoutSession);

/**
 * @openapi
 * /api/payments/confirm-checkout-session:
 *   post:
 *     tags:
 *       - Stripe checkout
 *     summary: Confirm a checkout session
 *     description: Confirms a Stripe checkout session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stripe_session_id:
 *                 type: string
 *                 description: ID of the Stripe session
 *     responses:
 *       200:
 *         description: Session confirmation success
 *       400:
 *         description: Validation errors or incorrect data
 *       500:
 *         description: Internal server error
 */
router.post(
  "/confirm-checkout-session",
  PaymentController.confirmStripeCheckoutSession
);

router.get("/subscriptions", PaymentController.getSubscriptions);
module.exports = router;
