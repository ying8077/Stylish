const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, SameSite: 'none'}
}))
const productRoute = require('./routes');
app.use('/api/products', productRoute);
const userRoute = require('./routes/user');
app.use('/api/users', userRoute);
const orderRoute = require('./routes/order');
app.use('/api/orders', orderRoute);

app.get('/', (req, res) => {
    res.send('connect');
});

app.listen(8000, () => {
    console.log('the application is running on port8080!');
}); 

module.exports = app