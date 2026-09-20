const User = require('../models/User');
const { SanitizeUser, registerUser, loginUser} = require('../services/auth.service');


async function me(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json({user: SanitizeUser(user)});
    } catch (error) {
        next(error);
    }
}

async function register(req, res, next) {
    try {
        const user = await registerUser(req.body);
        res.status(201).json( { user});
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { user, accessToken, refreshToken } = await loginUser(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7*24*60*60*1000,
        });

        res.json({user, accessToken});
    } catch (error) {
        next(error);
    }
}

module.exports = {register, login, me};