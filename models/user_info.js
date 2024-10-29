const db = require('../config/database');

// Define User model methods
const User = {
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) callback(err, null);
            else callback(null, results[0]);
        });
    },
    create: (userData, callback) => {
        const query = 'INSERT INTO users (user_id, firstname, lastname, age, gender, contact_num, email, sitio, barangay, province, roles, verification_token, verified, token_expiry, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, userData, (err, results) => {
            if (err) callback(err, null);
            else callback(null, results);
        });
    }
};

// Function to create the users table if it doesn't exist
function createUsersTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            user_id VARCHAR(250),
            firstname VARCHAR(250),
            lastname VARCHAR(250),
            age INT,
            gender VARCHAR(250),
            contact_num VARCHAR(250),
            email VARCHAR(250) UNIQUE,
            sitio VARCHAR(250),
            barangay VARCHAR(250),
            province VARCHAR(250),
            roles VARCHAR(250),
            verification_token VARCHAR(250),
            verified TINYINT(1) DEFAULT 0,
            token_expiry DATETIME,
            password VARCHAR(250)
        )
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created or already exists.');
        }
    });
}

// Call the function to create the table when the file is loaded
createUsersTable();

module.exports = User;
