const express = require('express');
const router = express.Router();
const Salereport = require('../Controllers/report/saleReport');
const purchaseReport = require('../Controllers/report/purchaseReport');
const cheackToken = require('../Middlewares/cheackToken');


router.get('/sale/totalSale',  cheackToken, Salereport.totalSale);
router.get('/sale/totalReceived',  cheackToken, Salereport.totalReceived);
router.get('/sale/totalDue',  cheackToken, Salereport.totalDue);
router.get('/sale/totalPorduct',  cheackToken, Salereport.totalPorduct);

router.get('/purchase/totalSale',  cheackToken, purchaseReport.totalPurchase);
router.get('/purchase/totalReceived',  cheackToken, purchaseReport.totalPayed);
router.get('/purchase/totalDue',  cheackToken, purchaseReport.totalDue);
router.get('/purchase/totalPorduct',  cheackToken, purchaseReport.totalPorduct);

module.exports = router;