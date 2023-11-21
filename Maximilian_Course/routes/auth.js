const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth.js');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    [
        check('email')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (!userDoc) {
                            return Promise.reject(`Invalid email or password.`);
                        }
                        return true;
                    });
            })
            .normalizeEmail(),
        body('password')
            .custom((value, { req }) => {
                return User.findOne({ email: req.body.email })
                    .then(userDoc => {
                        return bcrypt.compare(req.body.password, userDoc.password)
                            .then(value => {
                                if (!value) {
                                    return Promise.reject(`Invalid email or password.`);
                                }
                                req.session.isLoggedIn = true;
                                req.session.user = userDoc;
                                req.session.save(err => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                return true;
                            });
                    });
            })
            .trim()
    ]
    , authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(`E-mail exists already, please pick different one.`);
                        }
                    });
            })
            .normalizeEmail(),
        body('password', 'Please enter password with only number and text and at least 5 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(`Password doesn't match!`);
                }
                return true;
            })
    ],
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;