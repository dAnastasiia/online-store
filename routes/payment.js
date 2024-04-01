const express = require("express");

const paymentsController = require("../controllers/payment");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.getStripeWebhook
);

module.exports = router;
