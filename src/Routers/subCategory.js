const express = require('express');
const router = express.Router();
const subCategory = require('../Controllers/subCategory');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');



router.get('/', cheackToken, subCategory.allSubCategory);

router.get('/search', cheackToken, subCategory.searchSubCategory);

router.get('/:id', cheackToken, validObjectId, subCategory.singleSubCategory);

router.post('/', cheackToken, subCategory.addSubCategory)

router.put('/:id', cheackToken, validObjectId, subCategory.updateSubCategory);

router.delete('/:id', cheackToken, validObjectId, subCategory.deleteSubCategory);

module.exports = router;