const express = require('express');
const {
  inventory_index,
  product_get,
} = require('../controllers/inventoryController.js');

const router = express.Router();

router.get('/', inventory_index);
router.get('/:id', product_get);

module.exports = router;
