const express = require('express');
const validObjectId = require('../Middlewares/validObjectId');
const router = express.Router();
const customerDue = require('../Controllers/customerDue');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, customerDue.allDues);

router.get('/:id', cheackToken, validObjectId, customerDue.singleDue);

router.post('/:id', cheackToken, validObjectId, customerDue.getDue);

module.exports = router;