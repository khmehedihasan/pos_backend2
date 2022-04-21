const express = require('express');
const router = express.Router();
const supplier = require('../Controllers/supplier');
const validObjectId = require('../Middlewares/validObjectId');
const uploadPhoto = require('../Middlewares/uploadPhoto');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, supplier.allSupplier);

router.get('/:id', cheackToken,  validObjectId,supplier.singleSupplier)

router.post('/', cheackToken,  uploadPhoto.single('photo'), supplier.addSupplier);

router.put('/:id', cheackToken,  validObjectId, uploadPhoto.single('photo'), supplier.updateSupplier);

router.delete('/:id', cheackToken,  validObjectId, supplier.deleteSupplier);

module.exports = router;