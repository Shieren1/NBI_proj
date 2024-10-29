const User = require('../models/user_info');
const bcrypt = require('bcrypt');

// Render the registration page
exports.registerPage = (req, res) => {
    // Ensure successMessage is always passed to the view
    res.render('register', { successMessage: null });
};

// Handle user registration
exports.registerUser = (req, res) => {
    const { user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, password } = req.body;

    // Define additional values as needed
    const verification_token = null; // Set according to your logic
    const verified = 0; // 0 for not verified
    const token_expiry = null; // Set according to your needs

    // Check if the email already exists
    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error.');
        }
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Error hashing password.');
            }

            // Prepare user data for insertion
            const userData = [
                user_id, firstname, lastname, age, gender, contact_num, email, 
                sitio, barangay, province, roles, verification_token, verified, token_expiry, hashedPassword
            ];
            
            // Insert the new user into the database
            User.create(userData, (err, results) => {
                if (err) {
                    console.error('Error saving user to database:', err);
                    return res.status(500).send('Error saving user to database.');
                }

                // Registration successful, render success message
                res.render('register', { successMessage: 'Registration successful!' });
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
