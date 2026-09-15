const express = require('express');
const {
  inventory_index,
  whiskey_edit_get,
  whiskey_new_get,
  whiskey_new_post,
  whiskey_edit_post,
  whiskey_delete_post,
} = require('../controllers/inventoryController.js');

const router = express.Router();

router.get('/', inventory_index);
router.get('/new', whiskey_new_get);
router.post('/new', whiskey_new_post);
router.get('/:id', whiskey_edit_get);
router.post('/:id/edit', whiskey_edit_post);
router.post('/:id/delete', whiskey_delete_post);

module.exports = router;
