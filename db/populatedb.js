#! /usr/bin/env node

const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS category (
  category_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS whiskey (
  whiskey_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  age INT,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES category(category_id)
);

INSERT INTO category (name)
VALUES
  ('Scotch'),
  ('Bourbon'),
  ('Irish'),
  ('Japanese'),
  ('Tennessee');

INSERT INTO whiskey (name, age, price, stock, category_id)
VALUES
  ('Glenfiddich 12', 12, 45.00, 10, 1),
  ('Maker''s Mark', NULL, 35.00, 12, 2),
  ('Bushmills 10', 10, 45.00, 8, 3),
  ('Jack Daniel''s Old No. 7', NULL, 30.00, 10, 5),
  ('The Macallan 12', 12, 85.00, 5, 1),
  ('Yamazaki 12', 12, 150.00, 3, 4),
  ('Johnnie Walker Black Label', 12, 40.00, 10, 1),
  ('Maker''s Mark 46', NULL, 50.00, 8, 2),
  ('Bushmills Original', NULL, 30.00, 10, 3),
  ('Glenfiddich 15', 15, 65.00, 7, 1),
  ('Johnnie Walker Red Label', NULL, 25.00, 12, 1),
  ('Yamazaki Distiller''s Reserve', NULL, 90.00, 5, 4),
  ('Bushmills 16', 16, 90.00, 3, 3),
  ('Glenfiddich 18', 18, 110.00, 4, 1),
  ('The Macallan Double Cask 12', 12, 75.00, 6, 1),
  ('Bushmills Black Bush', NULL, 35.00, 9, 3);

`;

async function main() {
  console.log('seeding...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
