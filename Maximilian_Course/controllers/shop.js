const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');

const { log } = require("console");

exports.getProducts = (req, res, next) => {
    console.log("getProducts_shop: ", process.env.views);

    switch (process.env.views) {
        case 'html':
            res.sendFile(path.join(rootDir, 'views/views_html', 'shop.html')); // without any view engine
            break;
        case 'pug':
            let products = Product.fetchAll();
            res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' }); // with pug as a view engine
            break;
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
                }); // with handlebars as a view engine
            });
            break;
        case 'ejs':
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("shop/product-list", {
                    prods: products,
                    pageTitle: "Shop",
                    path: "/products",
                    views: process.env.views,
                    hasProducts: products.length > 0 ? true : false,
                });
            });
            break;
        case 'ejsWithDb':
            Product.fetchAll()
                .then(products => {
                    // console.log('Product: ', products);
                    res.render("shop/product-list", {
                        prods: products,
                        pageTitle: "Shop",
                        path: "/products",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                    });
                }).catch(err => {
                    console.log(err);
                });
            break;
        case 'ejsWithDbMongoose':
            Product.find()
                .then(products => {
                    // console.log('Product: ', products);
                    res.render("shop/product-list", {
                        prods: products,
                        pageTitle: "Shop",
                        path: "/products",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                    });
                }).catch(err => {
                    console.log(err);
                });
            break;
    }
};

exports.getProduct = (req, res, next) => {
    console.log("getProduct_shop: ", process.env.views);

    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                views: process.env.views,
                path: '/products'
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    console.log("postCart_shop: ", process.env.views);

    const prodId = req.body.productId;
    switch (process.env.views) {
        case 'hbs':
        case 'ejs':
            Product.findById(prodId, product => {
                Cart.addProduct(product.id, product.price);
            });
            console.log(prodId);
            res.render('shop/cart', { views: process.env.views })
            break;
        case 'ejsWithDb':
        case 'ejsWithDbMongoose':
            Product.findById(prodId)
                .then(product => {
                    // console.log('req.user: ', req.user);
                    req.user.addToCart(product);
                    res.redirect('/cart')
                })
                .catch(err => {
                    console.log(err);
                })
            break;
    }
}

exports.getIndex = (req, res, next) => {
    console.log("getIndex_shop: ", process.env.views);

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
                    path: "/",
                    views: process.env.views,
                    hasProducts: products.length > 0 ? true : false,
                });
            });
            break;
        case 'ejsWithDb':
            Product.fetchAll()
                .then(products => {
                    // console.log('Product: ', products);
                    res.render("shop/index", {
                        prods: products,
                        pageTitle: "Shop",
                        path: "/",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                    });
                }).catch(err => {
                    console.log(err);
                });
            break;
        case 'ejsWithDbMongoose':
            Product.find()
                .then(products => {
                    // console.log('Product: ', products);
                    res.render("shop/index", {
                        prods: products,
                        pageTitle: "Shop",
                        path: "/",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                    });
                }).catch(err => {
                    console.log(err);
                });
            break;
    }

};

exports.getCart = (req, res, next) => {
    console.log("getCart_shop: ", process.env.views);

    switch (process.env.views) {
        case 'hbs':
        case 'ejs':
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
                        views: process.env.views,
                        products: cartProducts
                    });
                });
            });
            break;
        case 'ejsWithDb': {
            // User.findById(req.user._id)
            //     .then(async (user) => {
            //         const cartItems = user.cart.items;
            //         let cartProducts = [];

            //         const promises = cartItems.map(item => {
            //             return Product.findById(item.productId.toString())
            //                 .then(product => {
            //                     cartProducts.push({ ...product, qty: item.qty });
            //                 });
            //         });

            //         return Promise.all(promises)
            //             .then(() => {
            //                 // console.log(cartProducts);
            //                 res.render("shop/cart", {
            //                     pageTitle: "My Cart",
            //                     path: "/cart",
            //                     views: process.env.views,
            //                     products: cartProducts
            //                 });
            //             });
            //     });

            req.user.getCart()
                .then(cartItems => {
                    // console.log(cartItems);
                    res.render("shop/cart", {
                        pageTitle: "My Cart",
                        path: "/cart",
                        views: process.env.views,
                        products: cartItems
                    });
                })
                .catch(err => console.log(err));
        }
            break;
        case 'ejsWithDbMongoose':

            req.user
                .populate('cart.items.productId')
                .then(user => {
                    const products = user.cart.items;
                    res.render("shop/cart", {
                        pageTitle: "My Cart",
                        path: "/cart",
                        views: process.env.views,
                        products: products
                    });
                })
                .catch(err => console.log(err));
            break;

    }

};

exports.postCartDeleteProduct = (req, res, next) => {
    console.log("postCartDeleteProduct_shop: ", process.env.views);

    const productId = req.body.productId;

    switch (process.env.views) {
        case 'ejs':
            Product.findById(productId, product => {
                Cart.deleteProduct(productId, product.price);
                res.redirect('/cart');
            });
            break;
        case 'ejsWithDb':
        case 'ejsWithDbMongoose':
            req.user.deleteItemFromCart(productId)
                .then(result => {
                    res.redirect('/cart');
                })
                .catch(err => console.log(err));
            break;
    }
}

exports.getOrders = (req, res, next) => {
    console.log("getOrders_shop: ", process.env.views);

    switch (process.env.views) {
        case 'ejsWithDb':
            req.user.getOrders()
                .then(orders => {
                    res.render("shop/orders", {
                        pageTitle: "My Orders",
                        views: process.env.views,
                        path: "/orders",
                        orders: orders
                    });
                });
            break;
        case 'ejsWithDbMongoose':
            Order.find({ 'user.userId': req.user._id })
                .then(orders => {
                    res.render("shop/orders", {
                        pageTitle: "My Orders",
                        views: process.env.views,
                        path: "/orders",
                        orders: orders
                    });
                });
            break;
    }
};

exports.postOrder = (req, res, next) => {
    console.log("postOrder_shop: ", process.env.views);

    switch (process.env.views) {
        case 'ejsWithDb':
            req.user
                .addOrder()
                .then(result => {
                    res.redirect('/orders');
                })
                .catch(err => console.log(err));
            break;
        case 'ejsWithDbMongoose':
            req.user
                .populate('cart.items.productId')
                .then(user => {
                    const products = user.cart.items.map(i => {
                        return { qty: i.qty, product: { ...i.productId._doc } };
                    });
                    const order = new Order({
                        products: products,
                        user: {
                            name: req.user.name,
                            userId: req.user._id
                        }
                    });
                    return order.save();
                }).then(result => {
                    req.user.clearCart();
                    res.redirect('/orders');
                })
                .catch(err => console.log(err));
            break;
    }
}

exports.getCheckout = (req, res, next) => {
    console.log("getCheckout_shop: ", process.env.views);

    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
    });
};