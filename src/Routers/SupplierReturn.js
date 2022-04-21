const express = require('express');
const supplierReturn = require('../Controllers/supplierReturn');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');
const router = express.Router();

router.get('/', cheackToken, supplierReturn.allReturn);

router.get('/:id', cheackToken, validObjectId, supplierReturn.singleReturn);

router.post('/:id', cheackToken, validObjectId, supplierReturn.returnProduct);

module.exports = router;