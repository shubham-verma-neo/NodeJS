const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    console.log("getLogin_auth: ", process.env.views);

    // let isLoggedIn;
    // isLoggedIn = req.get('Cookie').trim().split('=')[1];
    // console.log(isLoggedIn);

    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
        pageTitle: "Login",
        views: process.env.views,
        isAuthenticated: req.session.isLoggedIn,
        path: "/login",
    });
};

exports.postLogin = (req, res, next) => {
    console.log("postLogin_auth: ", process.env.views);
    
    // res.setHeader('Set-Cookie', 'loggedIn=true');
    User.findById("652d07e338dba78b8f57baed")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save();
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    console.log("getLogin_auth: ", process.env.views);
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};