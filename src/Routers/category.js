const express = require('express');
const router = express.Router();
const category = require('../Controllers/category');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, category.allCategory);

router.get('/search', cheackToken, category.searchCategory);

router.get('/:id', cheackToken, validObjectId ,category.singleCategory);

router.post('/', cheackToken, category.addCategory)

router.put('/:id', cheackToken, validObjectId, category.updateCategory);

router.delete('/:id', cheackToken, validObjectId, category.deleteCategory);

module.exports = router;