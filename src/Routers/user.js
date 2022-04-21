const express = require('express');
const router = express.Router();
const user = require('../Controllers/user');
const cheackToken = require('../Middlewares/cheackToken')


router.get('/', cheackToken, user.getAlluser);
router.post('/', cheackToken, user.addUser);
router.post('/login',user.loginUser);
router.delete('/logout', cheackToken, user.logoutUser);

module.exports = router;