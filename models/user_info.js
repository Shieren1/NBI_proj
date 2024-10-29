    const db = require('../config/database');

    const User = {
        findByEmail: (email, callback) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) callback(err, null);
                else callback(null, results[0]);
            });
        },
        create: (userData, callback) => {
            const query = 'INSERT INTO users (user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(query, userData, (err, results) => {
                if (err) callback(err, null);
                else callback(null, results);
            });
        }
    };

    module.exports = User;