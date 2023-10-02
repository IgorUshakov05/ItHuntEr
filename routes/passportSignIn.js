const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/registrationUser')
require('dotenv').config();
function generaterId() {
    let min = 10000000000000; // Минимальное значение (14 нулей)
    let max = 99999999999999; // Максимальное значение (14 девяток)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const THREE_MINUTES = 60 * 1000;
async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user; // Если пользователь найден, вернуть его объект; если не найден, вернуть null.
    } catch (error) {
        console.error('Ошибка при поиске пользователя по email:', error);
        throw error;
    }
}

passport.use('loginGoogle',new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL_LOGIN,
    scope: ['profile', 'email']
}, async function (accessToken, refreshToken, profile, done) {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    try {
        let user = await findUserByEmail(email);
        console.log(user)
        if (user) {
            console.log("Пользователь существует");
            return done(null, user);
        }

        else {
            return done(null, false);
        }
    } catch (error) {
        console.error('Ошибка при обработке пользователя:', error);
        return done(error, false);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;