const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const Auth = require('./routes/AuthOnServer')
const passport = require('./routes/passport'); // Импортируйте passport.js



router.post('/signing', [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6, max: 20 }).withMessage('Пароль должен быть длиной не менее 6 символов')
], Auth.login)
router.post('/signup', [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password1').isLength({ min: 6, max: 20 }).withMessage('Пароль должен быть длиной от 6 до 20 символов'),
    body('password2').isLength({ min: 6, max: 20 }).withMessage('Пароль должен быть длиной от 6 до 20 символов'),
    body('lastname').isLength({ min: 2, max: 20 }).withMessage('Фамилия должна быть длиной от 2 до 20 символов'),
    body('surname').isLength({ min: 2, max: 20 }).withMessage('Имя должно быть длиной от 2 до 20 символов'),
    body('date').isLength({ min: 8 }).withMessage('Дата должна быть длиной не менее 8 символов'),
    body('policy').notEmpty().withMessage('Вы должны принять политику конфиденциальности'),
    body('date').matches(/^\d{2}\.\d{2}\.\d{4}$/).withMessage('Дата должна быть в формате дд.мм.гггг'),
    body('date').custom((value) => {
        const currentDate = new Date();
        const enteredDate = new Date(value.slice(6, 10), value.slice(3, 5) - 1, value.slice(0, 2));
        if (enteredDate >= currentDate) {
            throw new Error('Дата должна быть меньше текущей');
        }
        return true;
    }),
], Auth.registration)

router.post('/verefyEmail', [
    body('email').isEmail().withMessage('Введите корректный email')],
    Auth.emailVerify)

router.post('/appendData',[body('date').isLength({ min: 8 }).withMessage('Дата должна быть длиной не менее 8 символов'),
    body('policy').notEmpty().withMessage('Вы должны принять политику конфиденциальности'),
    body('date').matches(/^\d{2}\.\d{2}\.\d{4}$/).withMessage('Дата должна быть в формате дд.мм.гггг'),
    body('date').custom((value) => {
        const currentDate = new Date();
        const enteredDate = new Date(value.slice(6, 10), value.slice(3, 5) - 1, value.slice(0, 2));
        if (enteredDate >= currentDate) {
            throw new Error('Дата должна быть меньше текущей');
        }
        return true;
    })], Auth.appendData)

router.post('/verefyCodeOnEmail', Auth.verefyCodeOnEmail)

router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/auth/google/callback/', passport.authenticate('google', {
    successRedirect: `${process.env.BASE_URL}more`, // Перенаправление на успешную страницу
    failureRedirect: `${process.env.BASE_URL}login?error=1`, // Перенаправление в случае неудачи
}));


module.exports = router