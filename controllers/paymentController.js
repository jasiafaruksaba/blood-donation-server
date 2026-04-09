import Payment from "../models/Payment.js";

// Get All Payments
export const getAllPayments = async (req, res) => {
  const payments = await Payment.find().sort({ paymentDate: -1 });
  res.json(payments);
};

// Create Payment (Stripe Checkout - Simplified)
export const createPayment = async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    const newPayment = new Payment({
      name,
      email,
      amount
    });

    await newPayment.save();

    res.status(201).json({ 
      message: "Payment recorded successfully",
      payment: newPayment 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};