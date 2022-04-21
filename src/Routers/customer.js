const express = require('express');
const router = express.Router();
const customer = require('../Controllers/customer');
const validObjectId = require('../Middlewares/validObjectId');
const uploadPhoto = require('../Middlewares/uploadPhoto');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, customer.allCustomer);

router.get('/:id', cheackToken, validObjectId, customer.singleCustomer);

router.post('/', cheackToken, uploadPhoto.single('photo'), customer.addCustomer)

router.put('/:id', cheackToken, validObjectId, uploadPhoto.single('photo'), customer.updateCustomer);

router.delete('/:id', cheackToken, validObjectId, customer.deleteCustomer);

module.exports = router;