const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true },
        qty: { type: Number, required: true }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        }
    }
});

module.exports = mongoose.model('orders', orderSchema);