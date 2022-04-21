const express = require('express');
const router = express.Router();
const category = require('../Controllers/category');
const uploadPhoto = require('../Middlewares/uploadPhoto');
const validObjectId = require('../Middlewares/validObjectId');
const cheackToken = require('../Middlewares/cheackToken');

router.get('/', cheackToken, category.allCategory);

router.get('/:id', cheackToken, validObjectId ,category.singleCategory);

router.post('/', cheackToken, uploadPhoto.single('photo') ,category.addCategory)

router.put('/:id', cheackToken, validObjectId, uploadPhoto.single('photo') ,category.updateCategory);

router.delete('/:id', cheackToken, validObjectId, category.deleteCategory);

module.exports = router;