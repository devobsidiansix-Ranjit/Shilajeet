import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from '@phonepe-pg/pg-sdk-node';
import { Order } from '../models/Order.js';

// PhonePe Credentials from environment or defaults
const clientId = process.env.PHONEPE_CLIENT_ID || "M22SGYECP7TW5_2605211959";
const clientSecret = process.env.PHONEPE_CLIENT_SECRET || "NDNlNGIyNmMtOTExMy00NWQ4LThhMDEtZDg4MzU5YWMzN2U3";
const clientVersion = 1;
const env = process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;

let client;
try {
  client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
  console.log(`PhonePe SDK client initialized successfully in ${env} mode`);
} catch (sdkError) {
  console.error("Error initializing PhonePe SDK client:", sdkError);
}

export const initiatePayment = async (req, res) => {
  try {
    const { order, redirectOrigin } = req.body;
    
    const txnId = "TXN" + Date.now();
    const amountInPaise = Math.round(order.price * 100);

    const redirectUrl = `${redirectOrigin}?txnId=${txnId}&status=check`;

    try {
      const newOrder = new Order({
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
    }

    if (!client) {
      console.log("No PhonePe client initialized. Simulating success redirect URL...");
      return res.json({
        success: true,
        transactionId: txnId,
        redirectUrl: `${redirectOrigin}?txnId=${txnId}&status=check`
      });
    }

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(txnId)
      .amount(amountInPaise)
      .redirectUrl(redirectUrl)
      .build();

    console.log(`Initiating PhonePe payment for order ${txnId}, amount: ₹${order.price}`);

    const response = await client.pay(request);

    if (response && response.redirectUrl) {
      res.json({
        success: true,
        transactionId: txnId,
        redirectUrl: response.redirectUrl
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to obtain redirect URL from PhonePe SDK"
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
    const { transactionId, order } = req.body;
    console.log(`Verifying payment for Transaction: ${transactionId}`);

    let isCompleted = false;

    if (!client) {
      console.log("Simulating PhonePe verification: Success");
      isCompleted = true;
    } else {
      const response = await client.getOrderStatus(transactionId);
      const state = response.state; 
      console.log(`PhonePe order status response state: ${state}`);
      if (state === 'COMPLETED') {
        isCompleted = true;
      }
    }

    if (isCompleted) {
      try {
        const updatedOrder = await Order.findOneAndUpdate(
          { txnId: transactionId },
          { paymentStatus: 'PAID' },
          { new: true }
        );
        if (!updatedOrder) {
          const newOrder = new Order({
            user: order.userId || null,
            txnId: transactionId,
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
            paymentStatus: 'PAID',
            deliveryStatus: 'Processing'
          });
          await newOrder.save();
          console.log(`Saved new PAID order for txn ${transactionId} (was missing pending order)`);
        } else {
          console.log(`Updated pending order to PAID for txn ${transactionId}`);
        }
      } catch (dbError) {
        console.error("Error saving/updating order in MongoDB:", dbError);
      }

      res.json({
        success: true,
        status: "PAID",
        transactionId: transactionId
      });
    } else {
      try {
        await Order.findOneAndUpdate(
          { txnId: transactionId },
          { paymentStatus: 'FAILED' }
        );
      } catch (dbError) {
        console.error("Error updating order to FAILED in MongoDB:", dbError);
      }
      
      res.json({
        success: false,
        status: "FAILED",
        message: "Payment failed or was cancelled."
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
