const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

// routing management
const userRoute = require('./routes/user.route');

app.use((req, res, next) => {
  req.xyz = '123';
  next();
});

app.use('/user', userRoute);

////////////////////////////////
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ extname: '.hbs' });

// Template engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// HTTP logger
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
