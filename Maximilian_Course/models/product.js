const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const products = [];

let p;
switch (process.env.views) {
    case 'hbs':
        p = path.join(path.dirname(require.main.filename), 'data', 'hbs_products.json');
        break;
    case 'ejs':
        p = path.join(path.dirname(require.main.filename), 'data', 'ejs_products.json');
        break;
}

const getProductsFromFile = (cb) => {
    fs.readFile(p, async (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}


module.exports = class Product {
    constructor(obj) {
        switch (process.env.views) {
            case 'hbs':
                this.title = obj.title;
            case 'ejs':
                this.id = obj.id;
                this.title = obj.title;
                this.imageurl = obj.imageurl;
                this.price = obj.price;
                this.description = obj.description;
        }
    }

    save() {
        switch (process.env.views) {
            case 'html':
            case 'pug':
                products.push(this);
                break;
            case 'hbs':
                getProductsFromFile(products => {
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), (err) => {
                        console.log("hbs_products_save_err: ", err);
                    });
                });
                break;
            case 'ejs':
                getProductsFromFile(products => {
                    if (this.id) {
                        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                        const updatedProducts = [...products];
                        updatedProducts[existingProductIndex] = this;
                        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                            console.log("ejs_products_updated_err: ", err);
                        });
                    } else {
                        this.id = Math.random().toString();
                        products.push(this);
                        fs.writeFile(p, JSON.stringify(products), (err) => {
                            console.log("ejs_products_save_err: ", err);
                        });
                    }
                });
                break;
        }
    }

    static fetchAll(cb) {
        switch (process.env.views) {
            case 'html':
            case 'pug':
                return products;
            case 'hbs':
                getProductsFromFile(cb);
                break;
            case 'ejs':
                getProductsFromFile(cb);
                break;
        }
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            // const productIndex = products.findIndex(prod => prod.id === id);
            // const updatedProducts = [...products];
            // updatedProducts.splice(productIndex, 1);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.productPrice);
                }
                console.log('err_delete_ejs: ', err);
            });
        });
    }
}