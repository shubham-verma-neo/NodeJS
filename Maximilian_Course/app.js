const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

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


const app = express();

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
        app.set("view engine", "ejs");
        app.set("views", "views/views_ejs");
        break;
}

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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
        app.use((req, res, next) => {
            User.findById("652d07e338dba78b8f57baed")
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    console.log(err);
                })
        });
        break;
}

app.use("/admin", adminData.routes);
app.use(shopRoutes);

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
                `mongodb+srv://verma-shu6ham:${process.env.mongoPassword}@nodejs.xwd8o9y.mongodb.net/${`shop_` + process.env.views}?retryWrites=true&w=majority`
            ).then(result => {
                User.findOne().then(user => {
                    if (!user) {
                        const user = new User({
                            name: 'Shubham',
                            email: 'shubham@test.com',
                            cart: {
                                items: []
                            }
                        });
                        user.save();
                    }
                });
                app.listen(3000);
            }).catch(err => {
                console.log(err);
            });
        break;
}
