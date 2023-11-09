const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');

let mongoConnect, mongoose;

switch (process.env.views) {
    case "ejsWithDb":
        mongoConnect = require('./util/database').mongoConnect;
        break;
    case "ejsWithDbMongoose":
        mongoose = require('mongoose');
        break;
}

const MONGODB_URI = `mongodb+srv://verma-shu6ham:${process.env.mongoPassword}@nodejs.xwd8o9y.mongodb.net/${`shop_` + process.env.views}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
let csrfProtection;

switch (process.env.views) {
    case "pug":
        app.set("view engine", "pug"); // pug is a kind of built in engine
        app.set("views", "views/views_pug");
        break;
    case "hbs":
        const { engine } = require('express-handlebars');
        app.engine("hbs", engine({ defaultLayout: "main-layout", extname: "hbs" })); // for not built in engine
        app.set("view engine", "hbs");
        app.set("views", "views/views_hbs");
        break;
    case "ejs":
    case "ejsWithDb":
    case "ejsWithDbMongoose":
        csrfProtection = csrf();
        app.set("view engine", "ejs");
        app.set("views", "views/views_ejs");
        break;
}

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

switch (process.env.views) {
    case 'ejsWithDb':
        app.use((req, res, next) => {
            User.findById("65126f752687e8e5d8570ff6")
                .then(user => {
                    const obj = { _id: user._id, name: user.name, email: user.email, cart: user.cart }
                    req.user = new User(obj);

                    next();
                })
                .catch(err => {
                    console.log(err);
                })
        });
        break;
    case 'ejsWithDbMongoose':
        app.use(csrfProtection);
        app.use(flash());
        
        app.use((req, res, next) => {
            if (!req.session.user) {
                return next();
            }
            User.findById(req.session.user._id)
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    console.log(err);
                })
        });

        app.use((req, res, next) => {
            res.locals.isAuthenticated = req.session.isLoggedIn;
            res.locals.csrfToken = req.csrfToken();
            next();
        });
        break;
}

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


switch (process.env.views) {
    case "ejsWithDb":
        console.log(process.env.views);
        mongoConnect(() => {
            app.listen(3001);
        });
        break;
    case "ejsWithDbMongoose":
        console.log(process.env.views);
        mongoose
            .connect(
                MONGODB_URI
            ).then(result => {
                app.listen(3000);
            }).catch(err => {
                console.log(err);
            });
        break;
}
