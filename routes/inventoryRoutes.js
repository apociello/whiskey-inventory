const express = require('express');
const {
  inventory_index,
  new_product_get,
  new_product_post,
  product_get,
  product_edit_post,
  product_delete_post,
} = require('../controllers/inventoryController.js');

const router = express.Router();

router.get('/', inventory_index);
router.get('/new-product', new_product_get);
router.post('/new-product', new_product_post);
router.post('/:id/edit', product_edit_post);
router.post('/:id/delete', product_delete_post);
router.get('/:id', product_get);

module.exports = router;
