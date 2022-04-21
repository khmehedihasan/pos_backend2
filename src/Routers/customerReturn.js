const express = require('express');
const customerReturn = require('../Controllers/customerReturn');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');
const router = express.Router();

router.get('/', cheackToken, customerReturn.allReturn);

router.get('/:id', cheackToken, validObjectId, customerReturn.singleReturn);

router.post('/:id', cheackToken, validObjectId, customerReturn.returnProduct);

module.exports = router;