const express = require('express');
const router = express.Router();
const subCategory = require('../Controllers/subCategory');
const uploadPhoto = require('../Middlewares/uploadPhoto');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');



router.get('/', cheackToken, subCategory.allSubCategory);

router.get('/:id', cheackToken, validObjectId, subCategory.singleSubCategory);

router.post('/', cheackToken, uploadPhoto.single('photo'), subCategory.addSubCategory)

router.put('/:id', cheackToken, validObjectId, uploadPhoto.single('photo'), subCategory.updateSubCategory);

router.delete('/:id', cheackToken, validObjectId, subCategory.deleteSubCategory);

module.exports = router;