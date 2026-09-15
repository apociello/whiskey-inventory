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
      w.whiskey_id,
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
      age: 'w.age',
      price: 'w.price',
      stock: 'w.stock',
    };

    if (sortColumns[sort]) {
      query += ` ORDER BY ${sortColumns[sort]}`;

      if (order === 'desc') {
        query += ' DESC';
      }

      query += ' NULLS LAST';
    }
  }

  const { rows } = await pool.query(query, values);
  return rows;
}

async function getWhiskey(id) {
  const query = `
    SELECT
      w.name AS whiskey_name,
      c.name AS category_name,
      w.whiskey_id,
      w.age,
      w.price,
      w.stock
    FROM whiskey w
    JOIN category c
      ON w.category_id = c.category_id
    WHERE w.whiskey_id = $1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function addWhiskey({ category, whiskey_name, age, price, stock }) {
  const categoryResult = await pool.query(
    'SELECT category_id FROM category WHERE name = $1',
    [category],
  );

  const category_id = categoryResult.rows[0].category_id;

  const query = `
    INSERT INTO whiskey (name, age, price, stock, category_id)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await pool.query(query, [whiskey_name, age, price, stock, category_id]);
}

module.exports = {
  getWhiskeys,
  getWhiskey,
  addWhiskey,
};
