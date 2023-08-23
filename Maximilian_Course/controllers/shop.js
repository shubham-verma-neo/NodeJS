const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render("shop/product-detail", { product: product, pageTitle: product.title, path: '/products' });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(product.id, product.price);
    });
    console.log(prodId);
    res.redirect('/cart')
}

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
    Cart.fetchAll(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render("shop/cart", {
                pageTitle: "My Cart",
                path: "/cart",
                products: cartProducts
            });
        });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    // const productPrice = req.body.productPrice;  
    // console.log(productId, productPrice);
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
}

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