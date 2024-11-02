const User = require('../models/user_info');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../services/email_service.js'); 

exports.registerPage = (req, res) => {
    res.render('register', { successMessage: null });
};

exports.registerUser = (req, res) => {
    const { user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, password } = req.body;

    const verificationToken = crypto.randomBytes(32).toString('hex'); 
    const verified = 0; 
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error.');
        }
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Error hashing password.');
            }

            const userData = [
                user_id, firstname, lastname, age, gender, contact_num, email, 
                sitio, barangay, province, roles, verificationToken, verified, tokenExpiry, hashedPassword
            ];
            
            User.create(userData, (err, results) => {
                if (err) {
                    console.error('Error saving user to database:', err);
                    return res.status(500).send('Error saving user to database.');
                }

                emailService.sendVerificationEmail(email, verificationToken)
                    .then(() => {
                        res.render('register', { successMessage: 'Registration successful! Please verify your email.' });
                    })
                    .catch(emailErr => {
                        console.error('Error sending verification email:', emailErr);
                        res.status(500).send('Registration successful, but failed to send verification email.');
                    });
            });
        });
    });
};

// Handle user logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out. Please try again.');
        }
        res.redirect('/login');
    });
};

// Verify email token
exports.verifyEmail = (req, res) => {
    const token = req.params.token;

    User.findByVerificationToken(token, (err, user) => {
        if (err) {
            console.error('Error finding user by token:', err);
            return res.status(500).send('Server error.');
        }
        if (!user) {
            return res.status(400).send('Invalid verification token.');
        }

        if (user.token_expiry < new Date()) {
            return res.status(400).send('Verification token has expired.');
        }

        User.verifyUser(user.id, (err) => {
            if (err) {
                console.error('Error verifying user:', err);
                return res.status(500).send('Server error during verification.');
            }
            res.redirect('/login?verified=true');
        });
    });
};

exports.profilePage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('User not authenticated');
        }
        const user = await User.findById(req.user.id); // Ensure req.user is populated correctly
        res.render('profilepage', { user }); // Ensure 'profilepage.ejs' is the correct view
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
