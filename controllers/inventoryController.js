const db = require('../db/queries');
const { query, matchedData } = require('express-validator');
const sanitizeSearch = [query('search').trim()];

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
    style: 'product',
  });
};

module.exports = {
  inventory_index,
  product_get,
};
