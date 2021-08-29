const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');
const { addProduct, getProducts, detailProduct, updateProduct, deleteProduct } = require('../controllers/product');
const { getUsers, deleteUser, addProfile } = require('../controllers/user');
const { authToken, permission } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

router.post('/login', login);
router.post('/register', register);

router.get('/users', authToken, permission('admin'), getUsers);
router.delete('/user/:id', deleteUser);
router.post('/profile', authToken, uploadFile('image'), addProfile);

router.get('/products', getProducts);
router.post('/product', addProduct);
router.get('/product/:id', detailProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

module.exports = router;
