import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

// Environment Configuration
const getApiKey = () => {
  console.log("getApiKey called. Value:", process.env.UROPAY_API_KEY);
  return process.env.UROPAY_API_KEY || 'TEST_8SS5TDJSWXNBPLSD';
};
const getApiSecret = () => {
  console.log("getApiSecret called. Value:", process.env.UROPAY_API_SECRET);
  return process.env.UROPAY_API_SECRET || 'TEST_SECRET';
};
const getWebhookSecret = () => process.env.UROPAY_WEBHOOK_SECRET || 'TEST_SECRET';
const apiBaseUrl = 'https://api.uropay.me';

// Utility helper to hash secret
const sha512 = (str) => {
  return crypto.createHash('sha512').update(str).digest('hex');
};

export const initiatePayment = async (req, res) => {
  try {
    const { order, redirectOrigin } = req.body;
    
    const txnId = "TXN" + Date.now();
    const amountInPaise = Math.round(order.price * 100);

    // Clean up duplicate pending orders for the same customer phone and product
    try {
      const deleteResult = await Order.deleteMany({
        phone1: order.phone1,
        productName: order.productName,
        paymentStatus: 'PENDING',
        submittedUTR: { $exists: false }
      });
      if (deleteResult.deletedCount > 0) {
        console.log(`Cleaned up ${deleteResult.deletedCount} duplicate pending orders for phone ${order.phone1}`);
      }
    } catch (cleanupErr) {
      console.error("Failed to clean up duplicate pending orders:", cleanupErr);
    }

    // Save initial order in MongoDB
    let newOrder;
    try {
      newOrder = new Order({
        user: order.userId || null,
        txnId: txnId,
        name: order.name,
        phone1: order.phone1,
        phone2: order.phone2,
        address: order.address,
        pincode: order.pincode,
        state: order.state,
        country: order.country,
        productName: order.productName,
        price: order.price,
        quantity: order.quantity || 1,
        paymentStatus: 'PENDING',
        deliveryStatus: 'Processing'
      });
      await newOrder.save();
      console.log(`Initial pending order created in MongoDB for txn ${txnId}`);
    } catch (saveErr) {
      console.error("Error creating initial pending order in DB:", saveErr);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    // Try to get email address for UroPay
    let customerEmail = order.email || 'guest@shilajeet.com';
    if (!order.email && order.userId) {
      try {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          customerEmail = user.email;
        }
      } catch (err) {
        console.error("Failed to query user email:", err);
      }
    }

    // Prepare payload for UroPay Generate Order API
    const payPayload = {
      amount: amountInPaise,
      merchantOrderId: txnId,
      customerName: order.name || 'Guest Customer',
      customerEmail: customerEmail,
      transactionNote: `For Order ${txnId}`
    };

    const hashedSecret = sha512(getApiSecret());
    const hostUrl = `${apiBaseUrl}/order/generate`;

    console.log(`Calling UroPay Generate Order API for order ${txnId}, amount: ₹${order.price}`);

    const response = await fetch(hostUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': getApiKey(),
        'Authorization': `Bearer ${hashedSecret}`
      },
      body: JSON.stringify(payPayload)
    });

    const responseText = await response.text();
    console.log("UroPay API raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(response.status).json({
        success: false,
        error: `UroPay returned status ${response.status}: ${responseText || 'No response details'}`
      });
    }

    if (data.status === 'success' && data.data) {
      const { uroPayOrderId, upiString, qrCode, amountInRupees } = data.data;
      
      // Update order with UroPay Order ID
      await Order.findOneAndUpdate({ txnId: txnId }, { uroPayOrderId });

      res.json({
        success: true,
        transactionId: txnId,
        uroPayOrderId,
        upiString,
        qrCode,
        amountInRupees
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.message || "Failed to generate UroPay order details"
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, referenceNumber, order } = req.body;
    console.log(`Verifying payment for Transaction: ${transactionId}, UTR: ${referenceNumber || 'N/A'}`);

    // Fetch the order from the database
    const dbOrder = await Order.findOne({
      $or: [{ txnId: transactionId }, { uroPayOrderId: transactionId }]
    });

    if (!dbOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // 1. If UTR is supplied, this is a UTR submission
    if (referenceNumber) {
      const uId = dbOrder.uroPayOrderId;
      if (!uId) {
        return res.status(400).json({ success: false, error: 'Order does not have a valid UroPay Order ID' });
      }

      const hashedSecret = sha512(getApiSecret());
      const updateUrl = `${apiBaseUrl}/order/update`;

      console.log(`Calling UroPay Update Order API for ${uId} with UTR: ${referenceNumber}`);

      const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': getApiKey(),
          'Authorization': `Bearer ${hashedSecret}`
        },
        body: JSON.stringify({
          uroPayOrderId: uId,
          referenceNumber: referenceNumber
        })
      });

      const responseText = await response.text();
      console.log("UroPay Update Order API raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        return res.status(response.status).json({
          success: false,
          error: `UroPay returned status ${response.status}: ${responseText || 'No response details'}`
        });
      }

      if (data.status === 'success') {
        dbOrder.submittedUTR = referenceNumber;
        dbOrder.paymentStatus = 'PENDING'; // Still pending verification by UroPay
        await dbOrder.save();

        return res.json({
          success: true,
          message: 'UTR submitted successfully. Waiting for verification.'
        });
      } else {
        return res.status(400).json({
          success: false,
          error: data.message || 'Failed to submit UTR to UroPay'
        });
      }
    }

    // 2. If UTR is not supplied, this is a status check/polling request
    if (dbOrder.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        status: "PAID",
        transactionId: dbOrder.txnId
      });
    }

    // Call UroPay Status API to check current state
    const uId = dbOrder.uroPayOrderId;
    if (!uId) {
      return res.json({
        success: false,
        status: "PENDING",
        message: "Order does not have a UroPay Order ID."
      });
    }

    const statusUrl = `${apiBaseUrl}/order/status/${uId}`;
    console.log(`Calling UroPay Status API for ${uId}`);

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': getApiKey()
        }
      });

      const responseText = await response.text();
      console.log("UroPay Status API response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        return res.status(response.status).json({
          success: false,
          error: `UroPay returned status ${response.status}: ${responseText || 'No response details'}`
        });
      }

      if (data.status === 'success' && data.data && data.data.orderStatus === 'COMPLETED') {
        // Payment completed! Update database
        dbOrder.paymentStatus = 'PAID';
        await dbOrder.save();

        // Increment product soldQty
        try {
          await Product.findOneAndUpdate(
            { name: dbOrder.productName },
            { $inc: { soldQty: dbOrder.quantity || 1 } }
          );
          console.log(`Incremented soldQty for product "${dbOrder.productName}" by ${dbOrder.quantity || 1}`);
        } catch (prodErr) {
          console.error("Failed to update product sold quantity:", prodErr);
        }

        return res.json({
          success: true,
          status: "PAID",
          transactionId: dbOrder.txnId
        });
      } else {
        return res.json({
          success: false,
          status: dbOrder.paymentStatus,
          message: "Payment is still pending or not confirmed."
        });
      }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

// Webhook payload reconstruction builders
function buildTransactionPayload(payload) {
  const FIXED_TAIL = ['uroPayOrderId', 'merchantOrderId', 'detectedAt', 'environment'];
  const fixedSet = new Set([...FIXED_TAIL, 'event']);
  const ordered = {};

  if ('event' in payload) ordered.event = payload.event;

  const middle = Object.keys(payload)
    .filter(k => !fixedSet.has(k))
    .sort((a, b) => a.localeCompare(b));
  for (const k of middle) ordered[k] = payload[k];

  for (const k of FIXED_TAIL) ordered[k] = payload[k] ?? null;

  return ordered;
}

function buildOrderStatusPayload(payload) {
  return {
    event:           payload.event,
    uroPayOrderId:   payload.uroPayOrderId,
    merchantOrderId: payload.merchantOrderId,
    orderStatus:     payload.orderStatus,
    submittedUTR:    payload.submittedUTR ?? null,
    environment:     payload.environment,
  };
}

function buildUtrSubmittedPayload(payload) {
  return {
    event:           payload.event,
    uroPayOrderId:   payload.uroPayOrderId,
    merchantOrderId: payload.merchantOrderId,
    orderStatus:     payload.orderStatus,
    submittedUTR:    payload.submittedUTR ?? null,
    amount:          payload.amount,
    customerName:    payload.customerName,
    customerEmail:   payload.customerEmail,
    customerVPA:     payload.customerVPA ?? null,
    environment:     payload.environment,
    utrSubmittedAt:  payload.utrSubmittedAt ?? null,
  };
}

// Webhook signature verification
function verifyWebhookSignature(payload, secret, signature) {
  const ordered =
    payload.event === 'order.status.utrsubmitted' ? buildUtrSubmittedPayload(payload)
    : 'orderStatus' in payload ? buildOrderStatusPayload(payload)
    : buildTransactionPayload(payload);

  const hashedSecret = sha512(secret);
  const payloadString = JSON.stringify(ordered);
  const computed = crypto.createHmac('sha256', hashedSecret)
    .update(payloadString)
    .digest('hex');

  console.log("UroPay Webhook Signature Debug:");
  console.log("- Ordered payload used:", payloadString);
  console.log("- Computed signature:", computed);
  console.log("- Received signature:", signature);

  if (computed.length !== signature.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}

export const uropayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-uropay-signature'] || '';
    const payload = req.body;

    console.log("Received UroPay Webhook. Header signature:", signature);
    console.log("Webhook body payload:", JSON.stringify(payload));

    if (!verifyWebhookSignature(payload, getWebhookSecret(), signature)) {
      console.warn("UroPay Webhook Signature mismatch. Rejecting request.");
      return res.status(401).send('Unauthorized - Signature mismatch');
    }

    const { event, uroPayOrderId, merchantOrderId, orderStatus } = payload;

    // Handle events
    if (
      event === 'companion.sms.data' || 
      (event === 'order.status.changed' && (orderStatus === 'COMPLETED' || orderStatus === 'PAID' || orderStatus === 'SUCCESS')) ||
      event === 'order.status.completed'
    ) {
      // Payment Completed! Find order by merchantOrderId (which matches our txnId) or uroPayOrderId
      const dbOrder = await Order.findOne({
        $or: [{ txnId: merchantOrderId }, { uroPayOrderId: uroPayOrderId }]
      });

      if (dbOrder && dbOrder.paymentStatus !== 'PAID') {
        dbOrder.paymentStatus = 'PAID';
        await dbOrder.save();
        console.log(`Order ${dbOrder.txnId} marked as PAID via Webhook event: ${event}`);

        // Increment product soldQty
        try {
          await Product.findOneAndUpdate(
            { name: dbOrder.productName },
            { $inc: { soldQty: dbOrder.quantity || 1 } }
          );
          console.log(`Incremented soldQty for product "${dbOrder.productName}" by ${dbOrder.quantity || 1}`);
        } catch (prodErr) {
          console.error("Failed to update product sold quantity in webhook:", prodErr);
        }
      }
    } else if (event === 'order.status.utrsubmitted') {
      // Save UTR if order status submitted
      const dbOrder = await Order.findOne({
        $or: [{ txnId: merchantOrderId }, { uroPayOrderId: uroPayOrderId }]
      });
      if (dbOrder) {
        dbOrder.submittedUTR = payload.submittedUTR;
        await dbOrder.save();
        console.log(`UTR ${payload.submittedUTR} saved to order ${dbOrder.txnId} via webhook`);
      }
    }

    // Webhooks must return HTTP 200 OK
    res.status(200).send('Webhook Processed Successfully');
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send('Internal Server Error');
  }
};
