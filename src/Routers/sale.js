const express = require('express');
const router = express.Router();
const sale = require('../Controllers/sale');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');


router.get('/', cheackToken, sale.allSale);

router.get('/:id', cheackToken, validObjectId, sale.singleSale);

router.post('/', cheackToken, sale.addSale)

router.put('/:id', cheackToken, validObjectId, sale.updateSale);

router.delete('/:id', cheackToken, validObjectId, sale.deleteSale);

module.exports = router;