import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.UROPAY_API_KEY;
const apiSecret = process.env.UROPAY_API_SECRET;

console.log("API Key:", JSON.stringify(apiKey), "Length:", apiKey ? apiKey.length : 0);
console.log("API Secret:", JSON.stringify(apiSecret), "Length:", apiSecret ? apiSecret.length : 0);

const sha512 = (str) => {
  return crypto.createHash('sha512').update(str).digest('hex');
};

const hashedSecret = sha512(apiSecret);
console.log("Hashed Secret:", hashedSecret);

async function run() {
  const payload = {
    amount: 100,
    merchantOrderId: "TXN" + Date.now(),
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    transactionNote: 'Test Order'
  };

  try {
    const res = await fetch('https://api.uropay.me/order/generate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'Authorization': `Bearer ${hashedSecret}`
      },
      body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    console.log("Headers:", JSON.stringify([...res.headers.entries()]));
    const text = await res.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

run();
