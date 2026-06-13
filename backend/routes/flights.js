const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = 'supersecret_for_demo';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/', authenticateToken, async (req, res) => {
    const { destination, origin, departure_date, return_date, passengers } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO flight_forms (user_id, destination, origin, departure_date, return_date, passengers) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, destination, origin, departure_date, return_date, passengers]
        );
        res.status(201).json({ message: 'Flight form saved successfully', formId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const [flights] = await db.execute(
            'SELECT origin, destination, departure_date, return_date, passengers FROM flight_forms WHERE user_id = ?',
            [req.user.id]
        );
        res.json({ flights });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

module.exports = router;
