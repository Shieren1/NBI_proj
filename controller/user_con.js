const User = require('../models/user_info'); 
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

let otpStorage = {}; 

exports.registerPage = (req, res) => {
    res.render('register'); 
};

exports.registerUser = (req, res) => {
    const { user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStorage[email] = otp;
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });
        
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@gmail.com',
            subject: 'Test Email',
            text: 'This is a test email.'
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
        });
    });
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] && otpStorage[email] == otp) {
        const { user_id, firstname, lastname, age, gender, contact_num, sitio, barangay, province, roles, password } = req.body;

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send('Error in password encryption.');

            const userData = [user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, hashedPassword];
            User.create(userData, (err, result) => {
                if (err) return res.status(500).send('Error saving user to database.');

                delete otpStorage[email]; 
                res.redirect('/login'); 
            });
        });
    } else {
        return res.status(400).send('Invalid OTP. Please try again.');
    }
};

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err || !user) {
            return res.status(400).send('Invalid email or password.');
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.status(400).send('Invalid email or password.');
            }
            req.session.userId = user.id; 
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