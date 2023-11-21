const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
    '/add-product',
    [
        body('title', 'Title should be more than 5 characters.')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageurl', 'Invalid image Url.')
            .isURL(),
        body('price', 'Please enter amount.')
            .isFloat(),
        body('description', 'Description should be more than 5 characters and less than 400 characters.')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    isAuth,
    adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
        body('title', 'Title should be more than 5 characters.')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageurl', 'Invalid image Url.')
            .isURL(),
        body('price', 'Please enter amount.')
            .isFloat(),
        body('description', 'Description should be more than 5 characters and less than 400 characters.')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    isAuth,
    adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;