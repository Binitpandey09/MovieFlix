const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).send(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId // Pass booking ID to update status
        } = req.body;

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ msg: "Transaction not legit!" });
        }

        // Update Booking Status
        if (bookingId) {
            const booking = await Booking.findById(bookingId);
            if (booking) {
                booking.status = 'Confirmed';
                booking.paymentId = razorpay_payment_id;
                await booking.save();
            }
        }

        res.json({
            msg: "Payment Verified Successfully",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).send(error);
    }
};

module.exports = { createOrder, verifyPayment };
