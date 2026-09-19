const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const SALT_ROUNDS = 10;

async function registerUser({ name, email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing) {
        const err = new Error('Email already registered');
        err.statusCode = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash, role });

    return SanitizeUser(user);
}

async function loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {user: SanitizeUser(user), accessToken, refreshToken};
}

function signAccessToken(user) {
    return jwt.sign({sub: user._id, role: user.role}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
    });
}

function signRefreshToken(user) {
    return jwt.sign({sub: user._id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}

function SanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
    };
}

module.exports = {registerUser, loginUser, signAccessToken, signRefreshToken, SanitizeUser};