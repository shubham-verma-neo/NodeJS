switch (process.env.views) {
    case "ejs":
    case "hbs":
        {
            const fs = require("fs");
            const path = require("path");

            const Cart = require("./cart");

            const products = [];

            let p;
            switch (process.env.views) {
                case "hbs":
                    p = path.join(
                        path.dirname(require.main.filename),
                        "data",
                        "hbs_products.json"
                    );
                    break;
                case "ejs":
                    p = path.join(
                        path.dirname(require.main.filename),
                        "data",
                        "ejs_products.json"
                    );
                    break;
            }

            const getProductsFromFile = (cb) => {
                fs.readFile(p, async (err, fileContent) => {
                    if (err) {
                        cb([]);
                    } else {
                        cb(JSON.parse(fileContent));
                    }
                });
            };

            module.exports = class Product {
                constructor(obj) {
                    switch (process.env.views) {
                        case "hbs":
                            this.title = obj.title;
                        case "ejs":
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
                            getProductsFromFile((products) => {
                                products.push(this);
                                fs.writeFile(p, JSON.stringify(products), (err) => {
                                    console.log("hbs_products_save_err: ", err);
                                });
                            });
                            break;
                        case 'ejs':
                            getProductsFromFile((products) => {
                                if (this.id) {
                                    const existingProductIndex = products.findIndex(
                                        (prod) => prod.id === this.id
                                    );
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
                    getProductsFromFile((products) => {
                        const product = products.find((p) => p.id === id);
                        cb(product);
                    });
                }

                static deleteById(id) {
                    getProductsFromFile((products) => {
                        const product = products.find((prod) => prod.id === id);
                        const updatedProducts = products.filter((prod) => prod.id !== id);
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
            };
        }
        break;
    case "ejsWithDb": {
        const mongodb = require('mongodb');
        const getDb = require("../util/database").getDb;

        class Product {
            constructor(obj) {
                this._id = obj.id ? new mongodb.ObjectId(obj.id) : null;
                this.title = obj.title;
                this.imageurl = obj.imageurl;
                this.price = obj.price;
                this.description = obj.description;
                this.userId = obj.userId;
            }

            save() {
                const db = getDb();
                let dbOp;
                if (this._id) {
                    dbOp = db.collection('products')
                        .updateOne({ _id: this._id }, {
                            $set: this
                        });
                } else {
                    dbOp = db.collection("products")
                        .insertOne(this);
                }
                return dbOp.then(result => {
                    console.log("ejsWithDb_save_result: ", result);
                })
                    .catch((err) => {
                        console.log("ejsWithDb_save_err: ", err)
                    });
            }

            static fetchAll() {
                const db = getDb();
                return db.collection('products')
                    .find()
                    .toArray()
                    .then(products => {
                        // console.log('ejsWithDb_fetchAll_products: ', products);
                        return products;
                    })
                    .catch(err => {
                        console.log('ejsWithDb_fetchAll_err: ', err);
                    })
            }

            static findById(prodId) {
                const db = getDb();
                return db.collection('products')
                    .find({ _id: new mongodb.ObjectId(prodId) })
                    .next()
                    .then(product => {
                        // console.log('ejsWithDb_findById_product: ', product);
                        return product;
                    }).catch(err => {
                        console.log('ejsWithDb_findById_err: ', err);
                    })
            }

            // static updateById(obj) {
            //     const db = getDb();
            //     db.collection('products')
            //         .updateOne({ _id: obj.id }, {
            //             $set: {
            //                 title: obj.title,
            //                 imageurl: obj.imageurl,
            //                 price: obj.price,
            //                 description: obj.description,
            //             }
            //         })
            //         .then(product => {
            //             // console.log(product);
            //         })
            //         .catch(err => {
            //             console.log('ejsWithDb_updateProductById_err: ', err);
            //         })
            // }

            static deleteById(prodId) {
                const db = getDb();
                db.collection('products')
                    .deleteOne({ _id: new mongodb.ObjectId(prodId) })
                    .then(() => {
                        console.log('Product Deleted.');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
        module.exports = Product;
    }
}
