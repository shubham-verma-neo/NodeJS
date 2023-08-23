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
            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false
            }); // with handlebars as a view engine
            break;
    }
};

exports.postAddProduct = (req, res, next) => {
    const obj = { id: null, title: req.body.title, imageurl: req.body.imageurl, price: req.body.price, description: req.body.description.trim() };
    const product = new Product(obj);
    product.save();
    res.redirect("/");
};

exports.postEditProduct = (req, res, next) => {
    console.log("postEditProduct: ", process.env.views);
    const obj = {id:req.body.productId, title: req.body.title, imageurl: req.body.imageurl, price: req.body.price, description: req.body.description.trim() };
    const updatedProduct = new Product(obj);
    updatedProduct.save();
    res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
    console.log(req.body.productId);
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
    console.log("getEditProduct: ", process.env.views);
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            res.redirect('/');
        }
        res.render("admin/edit-product", {
            pageTitle: "Add Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        }); // with handlebars as a view engine
    });

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