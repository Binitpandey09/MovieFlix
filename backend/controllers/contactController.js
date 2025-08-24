const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, email, issue } = req.body;

    if (!name || !email || !issue) {
        return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    // Create a transporter object using Gmail SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    let mailOptions = {
        from: `"${name}" <${email}>`, // Sender address
        to: 'vinitpandey858@gmail.com', // Your receiving email address
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Issue:</strong></p>
            <p>${issue}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email.' });
    }
};