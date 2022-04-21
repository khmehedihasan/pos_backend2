const express = require('express');
const validObjectId = require('../Middlewares/validObjectId');
const router = express.Router();
const supplierDue = require('../Controllers/supplierDue');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, supplierDue.allDues);

router.get('/:id', cheackToken, validObjectId, supplierDue.singleDue);

router.post('/:id', cheackToken, validObjectId, supplierDue.payDue);

module.exports = router;