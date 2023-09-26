const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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
        app.set("view engine", "ejs");
        app.set("views", "views/views_ejs");
        break;
}

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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
})

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3001);
});
