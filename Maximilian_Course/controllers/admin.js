const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
    console.log("getAddProduct_admin: ", process.env.views);

    switch (process.env.views) {

        case 'html':
            res.sendFile(path.join(rootDir, 'views/views_html', 'add-product.html')); // without any view engine

            break;
        case 'pug':
            res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' }); // with pug as a view engine
            break;
        case 'hbs':
            res.render("add-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                activeAddProduct: true,
                formsCSS: true,
                productCSS: true,
            }); // with handlebars as a view engine
            break;
        case 'ejs':
            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false
            }); // with handlebars as a view engine
            break;
        case 'ejsWithDb':
        case 'ejsWithDbMongoose':

            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                views: process.env.views,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
            break;
    }
};

exports.postAddProduct = (req, res, next) => {
    console.log("postAddProduct_admin: ", process.env.views);

    let obj, product;
    switch (process.env.views) {
        case 'ejs':
            obj = {
                id: null,
                title: req.body.title,
                imageurl: req.body.imageurl,
                price: req.body.price,
                description: req.body.description.trim(),
                userId: req.session.user._id
            };

            product = new Product(obj);
            product.save();
            res.redirect("/");
            break;
        case 'ejsWithDb':
            obj = {
                id: null,
                title: req.body.title,
                imageurl: req.body.imageurl,
                price: req.body.price,
                description: req.body.description.trim(),
                userId: req.session.user._id
            };

            product = new Product(obj);
            product.save()
                .then(result => {
                    // console.log("Product Created");
                    res.redirect('/admin/products');
                })
                .catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
        case 'ejsWithDbMongoose':
            const title = req.body.title;
            const price = req.body.price;
            const description = req.body.description;
            const imageurl = req.body.imageurl;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).render("admin/edit-product", {
                    pageTitle: "Add Product",
                    path: "/admin/edit-product",
                    editing: false,
                    views: process.env.views,
                    hasError: true,
                    product: {
                        title: title,
                        imageurl: imageurl,
                        price: price,
                        description: description
                    },
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()
                });
            }
            product = new Product({
                title: title,
                price: price,
                description: description,
                imageurl: imageurl,
                userId: req.session.user
            });
            product.save()
                .then(result => {
                    console.log("Product Created");
                    res.redirect('/admin/products');
                })
                .catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
    }
};

exports.postEditProduct = (req, res, next) => {
    console.log("postEditProduct_admin: ", process.env.views);

    let obj, updatedProduct;
    switch (process.env.views) {
        case 'ejs':
            obj = {
                id: req.body.productId,
                title: req.body.title,
                imageurl: req.body.imageurl,
                price: req.body.price,
                description: req.body.description.trim(),
                userId: req.session.user._id
            };

            updatedProduct = new Product(obj);
            updatedProduct.save();
            res.redirect("/admin/products");
            break;
        case 'ejsWithDb':
            obj = {
                id: req.body.productId,
                title: req.body.title,
                imageurl: req.body.imageurl,
                price: req.body.price,
                description: req.body.description.trim(),
                userId: req.session.user._id
            };

            updatedProduct = new Product(obj);
            updatedProduct.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!');
                    // Product.updateById(obj);
                    res.redirect("/admin/products");
                })
                .catch(err => {
                    console.log(err);
                });
            break;
        case 'ejsWithDbMongoose':


            let prodId = req.body.productId;
            let updatedTitle = req.body.title;
            let updatedPrice = req.body.price;
            let updatedDescription = req.body.description.trim();
            let updatedImageurl = req.body.imageurl;
            let userId = req.user._id;


            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    views: process.env.views,
                    editing: true,
                    hasError: true,
                    product: {
                        title: updatedTitle,
                        imageurl: updatedImageurl,
                        price: updatedPrice,
                        description: updatedDescription,
                        _id: prodId
                    },
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()
                });
            }

            Product.findById(prodId).then(product => {
                if (product.userId.toString() !== userId.toString()) {
                    return res.redirect('/');
                }
                product.title = updatedTitle;
                product.price = updatedPrice;
                product.description = updatedDescription;
                product.imageurl = updatedImageurl;
                return product.save().then(result => {
                    console.log('UPDATED PRODUCT!');
                    // Product.updateById(obj);
                    res.redirect("/admin/products");
                });
            })
                .catch(err => {
                    console.log(err);
                });
            break;
    }

};

exports.postDeleteProduct = (req, res, next) => {
    console.log("postDeleteProduct_admin: ", process.env.views);

    const productId = req.body.productId;
    const userId = req.user._id;

    switch (process.env.views) {
        case 'ejsWithDb':
            Product.deleteById(productId);
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
            break;
        case 'ejsWithDbMongoose':
            Product.deleteOne({ _id: productId, userId: userId }).then(() => {
                console.log('DESTROYED PRODUCT');
                res.redirect('/admin/products');
            });
            break;
    }
};

exports.getEditProduct = (req, res, next) => {
    console.log("getEditProduct_admin: ", process.env.views);

    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    switch (process.env.views) {
        case 'ejs':
            Product.findById(prodId, product => {
                if (!product) {
                    res.redirect('/');
                }
                res.render("admin/edit-product", {
                    pageTitle: "Add Product",
                    path: "/admin/edit-product",
                    editing: editMode,
                    views: process.env.views,
                    product: product
                }); // with handlebars as a view engine
            });
            break;
        case 'ejsWithDb':
        case 'ejsWithDbMongoose':

            Product.findById(prodId)
                .then(product => {
                    if (!product) {
                        res.redirect('/');
                    }
                    res.render("admin/edit-product", {
                        pageTitle: "Add Product",
                        path: "/admin/edit-product",
                        editing: editMode,
                        views: process.env.views,
                        product:product,
                        hasError: false,
                        errorMessage: null,
                        validationErrors: [],
                    }); // with handlebars as a view engine
                })
                .catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
    }
};

exports.getProducts = (req, res, next) => {
    console.log("getProducts_admin: ", process.env.views);
    const userId = req.user._id;
    switch (process.env.views) {
        case 'ejs':
            Product.fetchAll((products) => {
                // console.log('Product: ', products);
                res.render("admin/products", {
                    prods: products,
                    pageTitle: "Admin Products",
                    path: "/admin/products",
                    views: process.env.views,
                    hasProducts: products.length > 0 ? true : false,
                });
            });
            break;
        case 'ejsWithDb':
            Product.fetchAll()
                .then((products) => {
                    // console.log('Product: ', products);
                    res.render("admin/products", {
                        prods: products,
                        pageTitle: "Admin Products",
                        path: "/admin/products",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                    });
                }).catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
        case 'ejsWithDbMongoose':

            Product
                .find({ userId: userId })
                // .select('title price imageurl -_id')
                // .populate('userId', 'name')
                .then((products) => {
                    // console.log('Product: ', products);
                    res.render("admin/products", {
                        prods: products,
                        pageTitle: "Admin Products",
                        path: "/admin/products",
                        views: process.env.views,
                        hasProducts: products.length > 0 ? true : false,
                        //isAuthenticated: req.session.isLoggedIn,
                    });
                }).catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
    }
}