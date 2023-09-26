const path = require("path");

const rootDir = require("../util/path");

const Product = require('../models/product');

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
            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false
            }); // with handlebars as a view engine
            break;
    }
};

exports.postAddProduct = (req, res, next) => {
    console.log("postAddProduct_admin: ", process.env.views);

    const obj = {
        id: null,
        title: req.body.title,
        imageurl: req.body.imageurl,
        price: req.body.price,
        description: req.body.description.trim(),
        userId: req.user._id
    };

    let product;
    switch (process.env.views) {
        case 'ejs':
            product = new Product(obj);
            product.save();
            res.redirect("/");
            break;
        case 'ejsWithDb':
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
    }
};

exports.postEditProduct = (req, res, next) => {
    console.log("postEditProduct_admin: ", process.env.views);

    const obj = {
        id: req.body.productId,
        title: req.body.title,
        imageurl: req.body.imageurl,
        price: req.body.price,
        description: req.body.description.trim(),
        userId: req.user._id
    };
    let updatedProduct;
    switch (process.env.views) {
        case 'ejs':
            updatedProduct = new Product(obj);
            updatedProduct.save();
            res.redirect("/admin/products");
            break;
        case 'ejsWithDb':
            updatedProduct = new Product(obj);
            updatedProduct.save();
            // Product.updateById(obj);
            res.redirect("/admin/products");
            break;
    }

};

exports.postDeleteProduct = (req, res, next) => {
    console.log("postDeleteProduct_admin: ", process.env.views);

    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
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
            Product.findById(prodId)
                .then(product => {
                    console.log(product);
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
                })
                .catch(err => {
                    console.log('ejsWithDb_err: ', err);
                });
            break;
    }
};

exports.getProducts = (req, res, next) => {
    console.log("getProducts_admin: ", process.env.views);

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
    }
}