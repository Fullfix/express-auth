const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
require('dotenv/config');

const router = express.Router();

router.post('/login', passport.authenticate('local-login'), (req, res, next) => { 
    req.login(req.user, (err) => {
        if (err) {
            res.data = { err };
        }
        else {
            res.data = { 
                user: req.user,
                token: jwt.sign({ id: req.user._id }, process.env.SECRET_KEY, { expiresIn: '1d'})
            }
        }
        next();
    });
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            res.data.err = { err };
        }
        else if (!user) {
            res.data = { err: info.message };
        }
        else {
            res.data = {
                user: user,
                message: info.message
            };
        };
        next();
    })(req, res, next);
});

// example
router.post('/', passport.authenticate('jwt'), (req, res, next) => {
    res.data = { message: 'Authenticated successfully' };
    next();
});

module.exports = router;