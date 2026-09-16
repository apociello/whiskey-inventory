const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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

const whiskey_edit_get = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).render('404', { title: '404', style: '404' });
  }

  const whiskey = await db.getWhiskey(id);

  if (!whiskey) {
    return res.status(404).render('404', { title: '404', style: '404' });
  }

  res.render('whiskey_edit', {
    whiskey: whiskey,
    title: 'edit whiskey',
  });
};

const whiskey_new_get = (req, res) => {
  res.render('whiskey_new', { title: 'new whiskey' });
};

const whiskey_new_post = [
  validateWhiskey,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('whiskey_new', {
        title: 'new whiskey',
        errors: errors.array(),
        formData: req.body,
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

const whiskey_edit_post = [
  validateWhiskey,
  async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(404).render('404', { title: '404', style: '404' });
    }

    const errors = validationResult(req).array();

    if (req.body.password !== ADMIN_PASSWORD) {
      errors.push({ msg: 'Incorrect password.' });
    }

    if (errors.length > 0) {
      const whiskey = await db.getWhiskey(id);
      return res.status(400).render('whiskey_edit', {
        title: 'edit whiskey',
        whiskey,
        errors,
        formData: req.body,
      });
    }

    const { category, whiskey_name, age, price, stock } = matchedData(req);

    await db.editWhiskey(id, {
      category,
      whiskey_name,
      age: age ?? null,
      price,
      stock,
    });

    res.redirect('/inventory');
  },
];

const whiskey_delete_post = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).render('404', { title: '404', style: '404' });
  }

  if (req.body.password !== ADMIN_PASSWORD) {
    const whiskey = await db.getWhiskey(id);
    return res.status(401).render('whiskey_edit', {
      title: 'edit whiskey',
      whiskey,
      errors: [{ msg: 'Incorrect password.' }],
      formData: req.body,
    });
  }

  await db.deleteWhiskey(id);
  res.redirect('/inventory');
};

module.exports = {
  inventory_index,
  whiskey_edit_get,
  whiskey_new_get,
  whiskey_new_post,
  whiskey_edit_post,
  whiskey_delete_post,
};
