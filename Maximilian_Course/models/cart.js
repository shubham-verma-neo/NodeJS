const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'ejs_cart.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, async (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous data
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product / increase the quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log('ejs_addCart_err: ', err);
            });
        });
    };

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = +(updatedCart.totalPrice - productPrice * productQty).toFixed(2);
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log("err_deleteCart_ejs: ", err);
            });


            // let cart = JSON.parse(fileContent);
            // console.log("1", cart, productPrice);
            // const productIndex = cart.products.findIndex(prod => prod.id === id);
            // if (cart.products[productIndex].qty > 1) {
            //     cart.products[productIndex].qty = cart.products[productIndex].qty - 1;
            //     cart.totalPrice = cart.totalPrice - productPrice;
            // } else {
            //     cart.products.splice(productIndex, 1);
            //     cart.totalPrice = cart.totalPrice - productPrice;
            // }
            // fs.writeFile(p, JSON.stringify(cart), (err) => {
            //     console.log("2", cart);
            // })
        })
    }
};