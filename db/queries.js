const pool = require('./pool');

async function getWhiskeys(search, category, sort, order) {
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`w.name ILIKE $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`c.name = $${values.length}`);
  }

  let query = `
    SELECT
      w.name AS whiskey_name,
      c.name AS category_name,
      w.age,
      w.price,
      w.stock
    FROM whiskey w
    JOIN category c
      ON w.category_id = c.category_id
  `;

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (sort) {
    const sortColumns = {
      name: 'w.name',
      price: 'w.price',
      stock: 'w.stock',
    };

    query += ` ORDER BY ${sortColumns[sort]}`;

    if (order === 'desc') {
      query += ' DESC';
    }
  }

  const { rows } = await pool.query(query, values);
  return rows;
}

module.exports = {
  getWhiskeys,
};
