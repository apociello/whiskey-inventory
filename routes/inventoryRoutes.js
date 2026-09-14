const express = require('express');
const {
  inventory_index,
  new_product_get,
  new_product_post,
  product_get,
} = require('../controllers/inventoryController.js');

const router = express.Router();

router.get('/', inventory_index);
router.get('/new-product', new_product_get);
router.post('/new-product', new_product_post)
router.get('/:id', product_get);

module.exports = router;
