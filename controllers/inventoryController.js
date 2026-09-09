const db = require('../db/queries');

const inventory = async (req, res) => {
  const whiskeys = await db.getWhiskeys();
  res.render('index', { whiskeys });
};

module.exports = {
  inventory,
};
