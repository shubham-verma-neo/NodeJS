const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    switch (process.env.views) {

        case 'html':
            console.log("getAddProduct: ", process.env.views);
            res.sendFile(path.join(rootDir, 'views/views_html', 'add-product.html')); // without any view engine

            break;
        case 'pug':
            console.log("getAddProduct: ", process.env.views);
            res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' }); // with pug as a view engine
            break;
        case 'hbs':
            console.log("getAddProduct: ", process.env.views);
            res.render("add-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                activeAddProduct: true,
                formsCSS: true,
                productCSS: true,
            }); // with handlebars as a view engine
            break;
        case 'ejs':
            console.log("getAddProduct: ", process.env.views);
            res.render("admin/add-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                activeAddProduct: true,
                formsCSS: true,
                productCSS: true,
            }); // with handlebars as a view engine
            break;
    }
};

exports.postAddProduct = (req, res, next) => {
    const obj = { title: req.body.title, imageurl: req.body.imageurl, price: req.body.price, description: req.body.description };
    const product = new Product(obj);
    product.save();
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {

    // console.log("getIndex: ", process.env.views);
    Product.fetchAll((products) => {
        // console.log('Product: ', products);
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
            hasProducts: products.length > 0 ? true : false,
        });
    });
}