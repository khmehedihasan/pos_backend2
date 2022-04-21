const express = require('express');
const router = express.Router();
const purchase = require('../Controllers/purchase');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken,  purchase.allPurchase);

router.get('/:id', cheackToken,  validObjectId, purchase.singlePurchase);

router.post('/', cheackToken,  purchase.addPurchase)

router.put('/:id', cheackToken,  validObjectId, purchase.updatePurchase);

router.delete('/:id', cheackToken,  validObjectId, purchase.deletePurchase);


module.exports = router;