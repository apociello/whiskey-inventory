const db = require('../db/queries');
const { query, matchedData } = require('express-validator');
const sanitizeSearch = [query('search').trim()];

const inventory = [
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

module.exports = {
  inventory,
};
