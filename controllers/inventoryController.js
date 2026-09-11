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
  const whiskey = await db.getWhiskey(id);

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
