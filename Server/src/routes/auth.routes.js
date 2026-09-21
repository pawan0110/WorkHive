const express = require('express');

const { register, login} = require('../controllers/auth.controller')
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

// public routes - no auth required
router.post('/register', register);
router.post("/login", login);

// Protected route - any logged-in user, role doesn't matter
router.get('/me', requireAuth, me);

module.exports = router;