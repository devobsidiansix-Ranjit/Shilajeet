import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

// Environment Configuration
const env = process.env.PHONEPE_ENV || 'SANDBOX';
let merchantId = process.env.PHONEPE_CLIENT_ID || "M22SGYECP7TW5_2605211959";
const fullSecret = process.env.PHONEPE_CLIENT_SECRET || "NDNlNGIyNmMtOTExMy00NWQ4LThhMDEtZDg4MzU5YWMzN2U3";
let saltKey = fullSecret;
let saltIndex = 1;

if (fullSecret.includes('###')) {
  const parts = fullSecret.split('###');
  saltKey = parts[0];
  saltIndex = parseInt(parts[1]) || 1;
}

// Fallback to standard PhonePe Sandbox V1 credentials in Sandbox mode
if (env === 'SANDBOX') {
  merchantId = "PGTESTPAYUAT86";
  saltKey = "96434309-7796-489d-8924-ab56988a6076";
  saltIndex = 1;
  console.log("PhonePe running in SANDBOX mode. Using standard PGTESTPAYUAT86 V1 UAT credentials.");
} else {
  console.log(`PhonePe running in PRODUCTION mode. Merchant ID: ${merchantId}`);
}

export const initiatePayment = async (req, res) => {
  try {
    const { order, redirectOrigin } = req.body;
    
    const txnId = "TXN" + Date.now();
    const amountInPaise = Math.round(order.price * 100);
    const redirectUrl = `${redirectOrigin}?txnId=${txnId}&status=check`;

    // Save initial order in MongoDB
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

    const payPayload = {
      merchantId: merchantId,
      merchantTransactionId: txnId,
      merchantUserId: "MUID" + Date.now(),
      amount: amountInPaise,
      redirectUrl: redirectUrl,
      redirectMode: "REDIRECT",
      callbackUrl: redirectUrl,
      mobileNumber: order.phone1 || "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payPayload)).toString('base64');
    const stringToHash = base64Payload + "/pg/v1/pay" + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + "###" + saltIndex;

    const hostUrl = env === 'SANDBOX' 
      ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
      : 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

    console.log(`Calling PhonePe V1 Pay API at ${hostUrl} for order ${txnId}, amount: ₹${order.price}`);

    const response = await fetch(hostUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();
    console.log("PhonePe API raw response:", JSON.stringify(data));

    if (data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo) {
      const redirectUrlPhonePe = data.data.instrumentResponse.redirectInfo.url;
      res.json({
        success: true,
        transactionId: txnId,
        redirectUrl: redirectUrlPhonePe
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.message || "Failed to obtain redirect URL from PhonePe API"
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

    const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + "###" + saltIndex;

    const hostUrl = env === 'SANDBOX'
      ? `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`
      : `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`;

    console.log(`Calling PhonePe V1 Status API at ${hostUrl}`);

    const response = await fetch(hostUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId
      }
    });

    const data = await response.json();
    console.log("PhonePe verification response:", JSON.stringify(data));

    let isCompleted = false;
    if (data.success && data.data && data.data.state === 'COMPLETED') {
      isCompleted = true;
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

          // Increment soldQty
          await Product.findOneAndUpdate(
            { name: order.productName },
            { $inc: { soldQty: order.quantity || 1 } }
          );
          console.log(`Incremented soldQty for product "${order.productName}" by ${order.quantity || 1}`);
        } else {
          console.log(`Updated pending order to PAID for txn ${transactionId}`);

          // Increment soldQty using updatedOrder.productName
          await Product.findOneAndUpdate(
            { name: updatedOrder.productName },
            { $inc: { soldQty: updatedOrder.quantity || 1 } }
          );
          console.log(`Incremented soldQty for product "${updatedOrder.productName}" by ${updatedOrder.quantity || 1}`);
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
