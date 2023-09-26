const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(obj) {
        this._id = obj._id;
        this.name = obj.name;
        this.email = obj.email;
        this.cart = obj.cart;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                // console.log(result);
                console.log('User Created!');
            })
            .catch(err => {
                console.log('ejsWithDb_save_err: ', err);
            });
    }

    addToCart(product) {
        if (this.cart.items.length > 0) {
            const items = this.cart.items;
            // Check if the item already exists in the cart
            const existingItem = items.find(item => item.productId.toString() === product._id.toString());
            if (existingItem) {
                existingItem.qty++;
            } else {
                items.push({ productId: new mongodb.ObjectId(product._id), qty: 1 });
            }
            const updatedCart = this.cart;

            const db = getDb();
            return db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
        } else {
            const updatedCart = { items: [{ productId: new mongodb.ObjectId(product._id), qty: 1 }] };
            const db = getDb();
            return db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
        }
    }
    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => {
            return item.productId;
        });

        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                // console.log('1', productIds.filter(p => {
                //     return products.some(p1 => {
                //         if (p.toString() === p1._id.toString()) {

                //         }
                //     })
                // }))
                return products.map(product => {
                    return {
                        ...product,
                        qty: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).qty
                    }
                });
            });
    }
    deleteItemFromCart(productId) {
        console.log(this.cart.items);
        const updatedCartItems = this.cart.items.filter(item => {
            return productId.toString() !== item.productId.toString();
        });

        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }
    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
            }
            return db.collection('orders')
                .insertOne(order);
        }).then(result => {
            this.cart = { items: [] };
            return db.collection('users')
                .updateOne(
                    { _id: new mongodb.ObjectId(this._id) },
                    { $set: { cart: { items: [] } } }
                );
        });
    }
    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) })
            .toArray();
    }
    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then(user => {
                // console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            })
    }

}

module.exports = User;