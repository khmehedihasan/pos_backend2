const express = require('express');
const router = express.Router();
const product = require('../Controllers/product');
const validObjectId = require('../Middlewares/validObjectId');
const uploadPhoto = require('../Middlewares/uploadPhoto');
const cheackToken = require('../Middlewares/cheackToken');


router.get('/', cheackToken, product.allProduct);

router.get('/:id', cheackToken, validObjectId, product.singleProduct);

router.post('/', cheackToken, uploadPhoto.single('photo'), product.addProduct)

router.put('/:id', cheackToken, validObjectId, uploadPhoto.single('photo'), product.updateProduct);

router.delete('/:id', cheackToken, validObjectId, product.deleteProduct);

module.exports = router;