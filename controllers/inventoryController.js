const db = require('../db/queries');

const inventory = async (req, res) => {
  const whiskeys = await db.getWhiskeys();
  res.render('inventory', { whiskeys });
};

module.exports = {
  inventory,
};
