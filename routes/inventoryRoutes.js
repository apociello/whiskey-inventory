const express = require('express');
const { inventory } = require('../controllers/inventoryController.js');

const router = express.Router();

router.get('/', inventory);

module.exports = router;
