const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user_info'); // Update path if necessary
const emailService = require('../services/email_service.js'); // Update path if necessary

const register = async (req, res) => {
    const { firstname, lastname, email, password, age, gender, contact_num, sitio, barangay, province, roles } = req.body;

    // Basic validation
    if (!firstname || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password and create a verification token
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert the user data into the database
        const userData = [ /* user data values including hashed password and verificationToken */ ];
        await User.create(userData);

        // Send the verification email
        await emailService.sendVerificationEmail(email, verificationToken);

        res.status(200).json({ success: true, message: 'Registration successful. Please verify your email.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

const verifyEmail = async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findByVerificationToken(token);
        if (!user) {
            return res.status(400).send('Invalid verification token.');
        }

        if (user.token_expiry < new Date()) {
            return res.status(400).send('Verification token has expired.');
        }

        // Update the user's verification status
        await User.verifyUser(user.id);
        res.redirect('/login?verified=true');
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Server error during verification.');
    }
};

module.exports = { register, verifyEmail };
