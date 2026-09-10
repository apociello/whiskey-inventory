const db = require('../db/queries');

const inventory = async (req, res) => {
  let { search, category, sort, order } = req.query;

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
};

module.exports = {
  inventory,
};
