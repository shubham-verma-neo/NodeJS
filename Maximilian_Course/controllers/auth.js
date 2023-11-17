const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const mailgunTransport = require('nodemailer-mailgun-transport');

const User = require("../models/user");

const transporter = nodemailer.createTransport(mailgunTransport({
    auth: {
        api_key: process.env.mail_api_key,
        domain: process.env.mail_domain,
    }
}));

exports.getLogin = (req, res, next) => {
    console.log("getLogin_auth: ", process.env.views);

    // let isLoggedIn;
    // isLoggedIn = req.get('Cookie').trim().split('=')[1];
    // console.log(isLoggedIn);
    //console.log(req.session.isLoggedIn);

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }

    res.render("auth/login", {
        pageTitle: "Login",
        views: process.env.views,
        //isAuthenticated: req.session.isLoggedIn,
        path: "/login",
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    console.log("postLogin_auth: ", process.env.views);

    // res.setHeader('Set-Cookie', 'loggedIn=true');
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            // console.log(user);
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    console.log("postLogout_auth: ", process.env.views);
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    console.log("getSignup_auth: ", process.env.views);
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }

    res.render("auth/signup", {
        pageTitle: "Signup",
        views: process.env.views,
        // isAuthenticated: req.session.isLoggedIn,
        path: "/signup",
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    console.log("postSignup_auth: ", process.env.views);
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', `E-mail exists already, please pick different one.`)
                return res.redirect('/signup');
            }
            if (password === confirmPassword) {
                bcrypt.hash(password, 12)
                    .then(hashPassword => {
                        const user = new User({
                            email: email,
                            password: hashPassword,
                            cart: { items: [] }
                        });
                        return user.save();
                    })
                    .then(result => {
                        res.redirect('/login');
                        return transporter.sendMail({
                            to: email,
                            from: 'shubham@nodeJS-Maximilian.com',
                            subject: 'Signup succeeded!',
                            html: '<h1>You successfully signed up!</h1>'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                req.flash('error', `Password doesn't match.`)
                return res.redirect('/signup');
            }
        })
        .catch(err => {
            console.log(err);
        });


};


exports.getReset = (req, res, next) => {
    console.log("getReset_auth: ", process.env.views);
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }

    res.render("auth/reset", {
        pageTitle: "Reset Password",
        views: process.env.views,
        // isAuthenticated: req.session.isLoggedIn,
        path: "/reset",
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    console.log("postReset_auth: ", process.env.views);
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email id.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: email,
                    from: 'shubham@nodeJS-Maximilian.com',
                    subject: 'Reset Password!',
                    html:
                        `
                    <p>You requested the password reset.</p>
                    <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set new password.</p>
                    `
                })
            })
            .catch(err => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    console.log("getNewPassword_auth: ", process.env.views);

    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null
            }
            res.render("auth/new-password", {
                pageTitle: "New Password",
                views: process.env.views,
                // isAuthenticated: req.session.isLoggedIn,
                path: `/new-password`,
                errorMessage: message,
                userId: user._id,
                resetToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    console.log("postNewPassword_auth: ", process.env.views);

    const token = req.body.passwordToken;
    const userId = req.body.userId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            if (password === confirmPassword) {
                bcrypt.hash(password, 12)
                    .then(hashPassword => {
                        user.password = hashPassword;
                        user.resetToken = undefined;
                        user.resetTokenExpiration = undefined;
                        return user.save();
                    })
                    .then(result => {
                        return res.redirect('/login');
                        // return transporter.sendMail({
                        //     to: user.email,
                        //     from: 'shubham@nodeJS-Maximilian.com',
                        //     subject: 'Password Reset Successfully',
                        //     html: '<h1>You successfully updated you password.</h1>'
                        // })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                req.flash('error', `Password doesn't match.`)
                return res.redirect(`/reset/${token}`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}