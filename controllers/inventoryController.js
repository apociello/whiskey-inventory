const db = require('../db/queries');
const {
  body,
  validationResult,
  query,
  matchedData,
} = require('express-validator');

// Validations
const sanitizeSearch = [query('search').trim()];
const validateWhiskey = [
  body('category')
    .isIn(['Scotch', 'Bourbon', 'Irish', 'Japanese', 'Tennessee'])
    .withMessage('Invalid category.'),
  body('whiskey_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Whiskey name must be between 1 and 50 characters.'),
  body('age')
    .optional({ values: 'falsy' })
    .isInt({ min: 1, max: 100 })
    .withMessage('Age must be between 1 and 100.')
    .toInt(),
  body('price')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Price must be between 1 and 100,000.')
    .toFloat(),
  body('stock')
    .isInt({ min: 0, max: 10000 })
    .withMessage('Stock must be between 0 and 10000.')
    .toInt(),
];

const inventory_index = [
  sanitizeSearch,
  async (req, res) => {
    let { category, sort, order } = req.query;
    const { search } = matchedData(req);

    if (!sort) {
      order = '';
    } else if (!order) {
      order = 'asc';
    }

    const whiskeys = await db.getWhiskeys(search, category, sort, order);

    res.render('index', {
      whiskeys: whiskeys,
      title: 'index',
      style: 'index',
      search,
      category,
      sort,
      order,
    });
  },
];

const product_get = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).render('404', { title: '404', style: '404' });
  }

  const whiskey = await db.getWhiskey(id);

  if (!whiskey) {
    return res.status(404).render('404', { title: '404', style: '404' });
  }

  res.render('product', {
    whiskey: whiskey,
    title: 'product',
  });
};

const new_product_get = (req, res) => {
  res.render('new_product', { title: 'new product' });
};

const new_product_post = [
  validateWhiskey,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render('new_product', {
        title: 'new product',
        errors: errors.array(),
      });
    }

    const { category, whiskey_name, age, price, stock } = matchedData(req);

    await db.addWhiskey({
      category,
      whiskey_name,
      age: age ?? null,
      price,
      stock,
    });

    res.redirect('/inventory');
  },
];

module.exports = {
  inventory_index,
  product_get,
  new_product_get,
  new_product_post,
};
