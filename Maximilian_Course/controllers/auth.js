const bcrypt = require('bcryptjs');

const User = require("../models/user");

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
            console.log(user);
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
                            console.log(err);
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