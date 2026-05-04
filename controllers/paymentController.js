const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getCollections } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.createPayment = async (req, res) => {
  try {
    const { paymentCollection } = getCollections();
    const { name, email, amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ message: "Minimum 100 BDT required" });
    }

    // Create Stripe checkout session
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'bdt',
          product_data: {
            name: 'Blood Donation Fund',
            description: `Fund from ${name}`,
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/funding?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/funding?cancelled=true`,
      metadata: {
        name,
        email
      }
    });

    // Create payment record (will be updated after payment)
    const paymentRecord = await paymentCollection.insertOne({
      name: name.trim(),
      email: email.trim(),
      amount: parseFloat(amount),
      stripeSessionId: session.id,
      paymentStatus: "pending",
      paymentDate: null,
      createdAt: new Date()
    });

    res.json({
      url: session.url,
      sessionId: session.id,
      paymentId: paymentRecord.insertedId
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentCollection } = getCollections();
    const sessionId = req.query.session_id;

    const session = await Stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      await paymentCollection.updateOne(
        { stripeSessionId: sessionId },
        {
          $set: {
            paymentStatus: "succeeded",
            paymentDate: new Date(),
            stripePaymentIntent: session.payment_intent,
            updatedAt: new Date()
          }
        }
      );
    }

    res.redirect(`${process.env.CLIENT_URL}/dashboard/funding?success=true&session=${sessionId}`);
  } catch (error) {
    console.error("Payment Success Handler Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { paymentCollection } = getCollections();
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      paymentCollection.find({})
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      paymentCollection.countDocuments({})
    ]);

    const allPaid = await paymentCollection.find({ paymentStatus: "succeeded" }).toArray();
    const totalFunding = allPaid.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      payments: payments.map(p => ({ ...p, _id: p._id.toString() })),
      totalFunding,
      totalCount: total,
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("GetPayments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};