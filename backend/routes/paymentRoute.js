// routes > auth.js

const express = require("express");
const PaymentController= require("../src/controllers/paymentController");
const router = express.Router();
// const PaymentController= require("../src/controllers/ ")
/**
 * @openapi
 * /api/payment/checkout:
 *   post:
 *     tags:
 *       - Stripe checkout
 *     summary: create an checkout session
 *     description:Creates an checkout session and gets url to checkout , success url and failure url
 *     requestBody:
 *       required: user_id
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: checkout url,successurl & failure url
 *       400:
 *         description: Validation errors or incorrect data.
 *       500:
 *         description: Internal server error.
 */
router.post("/checkout", PaymentController.createStripeCheckoutSession);
router.post(
  "/confirm-checkout-session",
  PaymentController.confirmStripeCheckoutSession
);

module.exports = router;
