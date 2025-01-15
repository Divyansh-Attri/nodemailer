const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// For incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary storage for email addresses until a database
let emailList = [];

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password or app password
  },
});

// Route to collect email addresses
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email address is required');
  }

  emailList.push(email);
  res.status(200).send('Email address added successfully!');
});

// Route to send emails
app.post('/send-emails', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).send('Subject and message are required');
    }

    // Send emails to all users in the list
    for (const email of emailList) {
      await transporter.sendMail({
        from: 'your-email@gmail.com', // Sender address
        to: email, // List of recipients
        subject: subject, // Subject line
        text: message, // Plain text body
      });
    }

    res.status(200).send('Emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('An error occurred while sending emails.');
  }
});
// Start the server
app.listen(port, () => {
  console.log('Server running at http://localhost:3000');
});
