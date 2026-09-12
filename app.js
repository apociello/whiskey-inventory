const express = require('express');
const inventoryRoutes = require('./routes/inventoryRoutes.js');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
  res.redirect('/inventory');
});

// inventory routes
app.use('/inventory', inventoryRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404.ejs', { title: '404', style: '404' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
