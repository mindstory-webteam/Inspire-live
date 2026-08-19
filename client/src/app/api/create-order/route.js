import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Keep in sync with ApplicationForm.jsx
const BASE_AMOUNT = 30500;
const GST_AMOUNT  = Math.round(BASE_AMOUNT * 0.18);   // 5490
const TOTAL       = BASE_AMOUNT + GST_AMOUNT;         // 35990

export async function POST(req) {
  const body = await req.json();

  const order = await razorpay.orders.create({
    amount: TOTAL * 100, // 3599000 paise = ₹35,990
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { applicantName: body.fullName, email: body.email },
  });

  return Response.json({ orderId: order.id, amount: order.amount });
}