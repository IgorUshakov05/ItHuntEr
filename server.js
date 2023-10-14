const express = require('express');
const app = express();
const cookieSession = require('cookie-session')
const path = require('path');
const passport = require('./routes/passport'); // Import the passport.js file
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require("./routes/pages");
const isLoggedIn = require('./AccessForAuth')
const routesAuth = require("./AuthRequest");
const findCity = require("./routes/findCity");

app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'dist'));



app.use(
    cookieSession({
        name: 'access', // Имя для cookie токена access
        keys: ['key1', 'key2'],
        maxAge: 24 * 60 * 60 * 1000, // Время жизни сессии access - 1 день
    })
);

app.use(
    cookieSession({
        name: 'refresh', // Имя для cookie токена refresh
        keys: ['refreshKey1', 'refreshKey2'], // Ключи для сессии refresh
        maxAge: 30 * 24 * 60 * 60 * 1000, // Время жизни сессии refresh - 30 дней
    })
);

app.use((req, res, next) => {
    if (!req.session.access || !req.session.refresh) {
        req.session.access = {};
        req.session.refresh = {}
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(isLoggedIn)

app.use(routes);
app.use(routesAuth);
app.get('/getCity/:value', findCity)

start = (PORT) => {
    try {
        mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Подключение к базе данных успешно');

                app.listen(PORT, () => {
                    console.log(`Server start ${process.env.SERVER_PORT}`);
                });
            })
            .catch((err) => console.error('Ошибка подключения к базе данных:', err));

    }
    catch (e) {
        console.log(e)
        process.exit(1);
    }
}
start(process.env.SERVER_PORT)
