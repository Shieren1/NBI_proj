const User = require('../models/user_info'); 
const bcrypt = require('bcrypt');

exports.registerPage = (req, res) => {
    res.render('register'); 
};

exports.registerUser = (req, res) => {
    const { user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) return res.status(500).send('Database error.');
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send('Error hashing password.');

            const userData = [user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, hashedPassword];
            
            User.create(userData, (err, results) => {
                if (err) {
                    console.error('Error details:', err); 
                    return res.status(500).send('Error saving user to database.');
                }

                res.send('Registration successful!');
            });
        });
    });
};

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) return res.status(500).send('Database error.');
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).send('Error comparing passwords.');
            if (!match) {
                return res.status(400).send('Invalid email or password.');
            }

            req.session.userId = user.user_id; 
            req.session.userRole = user.roles; 
            res.redirect('/dashboard'); 
        });
    });
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out. Please try again.');
        }
        res.redirect('/login');
    });
};
