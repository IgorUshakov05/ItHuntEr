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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, async function (accessToken, refreshToken, profile, done) {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        try {
            let user = await findUserByEmail(email);
        console.log(user)
            if (user) {
                console.log("Пользователь существует");
                // Передаем false в функцию done, чтобы указать, что аутентификация не прошла успешно
                return done(null, false);
            }

            else {
                // Если пользователь не существует, добавляем его в базу данных
                const id = generaterId();
                const password = generaterId();

                const newUser = new User({
                    id,
                    name: profile.name.givenName,
                    lastname: profile.name.familyName || profile.name.givenName,
                    email,
                    password,
                    policy: true,
                    photo: profile.photos[0].value,
                });

                const deletionTimeout = setTimeout(async () => {
                    try {
                        // Проверяем, что пользователь по-прежнему не указал данные `role` и `date`
                        const userInDatabase = await User.findOne({id:newUser.id});
                        if (!userInDatabase.role || !userInDatabase.date) {
                            await User.findByIdAndDelete(userInDatabase);
                            console.log('Пользователь удален из-за отсутствия данных `role` и `date`.');
                        }
                    } catch (error) {
                        console.error('Ошибка при удалении пользователя:', error);
                    }
                }, THREE_MINUTES);


                user = await newUser.save();
                return done(null, user);
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