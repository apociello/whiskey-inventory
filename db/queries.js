const pool = require('./pool');

async function getWhiskeys() {
  const { rows } = await pool.query(`
    SELECT
      w.name AS whiskey_name,
      c.name AS category_name,
      w.price,
      w.stock
    FROM whiskey w
    JOIN category c
    ON w.category_id = c.category_id;  
    `);
  return rows;
}

module.exports = {
  getWhiskeys,
};
