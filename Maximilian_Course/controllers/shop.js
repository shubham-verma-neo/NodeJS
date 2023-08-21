const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    switch (process.env.views) {

        case 'html':
            console.log("getProducts: ", process.env.views);
            res.sendFile(path.join(rootDir, 'views/views_html', 'shop.html')); // without any view engine
            break;
        case 'pug':
            console.log("getProducts: ", process.env.views);
            let products = Product.fetchAll();
            res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' }); // with pug as a view engine
            break;
        case 'hbs':
            console.log("getProducts: ", process.env.views);
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("shop", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/",
                    hasProducts: products.length > 0 ? true : false,
                    activeShop: true,
                    formsCSS: true,
                    productCSS: true,
                    // layout: false // if don't want to use main-layout
                }); // with handlebars as a view engine
            });
            break;
        case 'ejs':
            console.log("getProducts: ", process.env.views);
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("shop/product-list", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/",
                    hasProducts: products.length > 0 ? true : false,
                });
            });
            break;
    }
};

exports.getIndex = (req, res, next) => {

    // console.log("getIndex: ", process.env.views);
    switch (process.env.views) {
        case 'hbs':
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("shop", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/",
                    hasProducts: products.length > 0 ? true : false,
                    activeShop: true,
                    formsCSS: true,
                    productCSS: true,
                    // layout: false // if don't want to use main-layout
                });
            });
            break;
        case 'ejs':
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("shop/index", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/products",
                    hasProducts: products.length > 0 ? true : false,
                });
            });
            break;
    }
    
};

exports.getCart = (req, res, next) => {
    // console.log("getCart: ", process.env.views);

    res.render("shop/cart", {
        pageTitle: "My Cart",
        path: "/cart",
    });
};

exports.getOrders = (req, res, next) => {
    // console.log("getOrders: ", process.env.views);

    res.render("shop/orders", {
        pageTitle: "My Orders",
        path: "/orders",
    });
};

exports.getCheckout = (req, res, next) => {
    // console.log("getCheckout: ", process.env.views);

    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
    });
};