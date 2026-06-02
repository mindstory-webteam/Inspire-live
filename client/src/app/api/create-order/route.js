import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const body = await req.json();
  
  const order = await razorpay.orders.create({
    amount: 3590000, // ₹35,900 in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { applicantName: body.fullName, email: body.email },
  });

  return Response.json({ orderId: order.id, amount: order.amount });
}