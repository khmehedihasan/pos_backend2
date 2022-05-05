const express = require('express');
const router = express.Router();
const unit = require('../Controllers/unit');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, unit.allUnit);

router.get('/search', cheackToken, unit.searchUnit);

router.get('/:id', cheackToken, validObjectId ,unit.singleUnit);

router.post('/', cheackToken, unit.addUnit)

router.put('/:id', cheackToken, validObjectId, unit.updateUnit);

router.delete('/:id', cheackToken, validObjectId, unit.deleteUnit);

module.exports = router;