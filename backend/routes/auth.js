const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const db = require('../db');

const JWT_SECRET = 'supersecret_for_demo';

router.post('/register', async (req, res) => {
    const { name, address, phone, dob, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate 2FA Secret
        const secret = speakeasy.generateSecret({ name: `Sabados (${username})` });

        const [result] = await db.execute(
            'INSERT INTO users (name, address, phone, dob, username, password, two_factor_secret) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, address, phone, dob, username, hashedPassword, secret.base32]
        );

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            res.status(201).json({ 
                message: 'User registered successfully', 
                userId: result.insertId,
                qrCode: data_url,
                secret: secret.base32
            });
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Step 1 complete', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

router.post('/verify-2fa', async (req, res) => {
    const { userId, token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.two_factor_secret) {
            return res.status(400).json({ error: 'Two-factor authentication is not configured for this user' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: String(token).trim(),
            window: 2
        });

        if (verified) {
            const jwtToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token: jwtToken });
        } else {
            res.status(401).json({ error: 'Invalid 2FA token' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

module.exports = router;
