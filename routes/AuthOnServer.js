const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const LoginUser = require('../models/loginUser'); // вход
const User = require('../models/registrationUser'); // регистрация
const emailverefy = require('../models/email');
const Token = require('../models/refreshTokens')
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Exception = require('../Exception');

function generaterId() {
    let min = 10000000000000; // Минимальное значение (14 нулей)
    let max = 99999999999999; // Максимальное значение (14 девяток)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создаем транспортер для отправки писем
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Укажите вашего провайдера почты
    auth: {
        user: 'igorushakov005@gmail.com',
        pass: 'ttddylmmwiowhbpw'
    }
});


class Auth {
    async login(req, res) {
        let clientIP = req.ip;
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            // Если есть ошибки валидации, возвращаем ошибку клиенту
            return Exception.NotValidUserNotFaundLogin(res, 'Введены некорректные данные');
        }
        // Если данные прошли валидацию, выполняем аутентификацию
        const { email, password } = await req.body;


        const user = await  User.findOne({email})
        if (!user) {
            return Exception.NotValidUserNotFaundLogin(res, 'Пользывателя не найдено');
        }
        else {
            console.log(user)
        console.log(email, password);
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    // Обработка ошибки при сравнении
                    console.error(err);
                    return Exception.NotValidUserNotFaundLogin(res, 'Ошибка сервера');
                }

                if (isMatch) {
                    const accessToken = jwt.sign({ id:user.id, role:user.role }, process.env.ACCESS, { expiresIn: '1m' });
                    const refreshToken = jwt.sign({ id:user.id, email:user.email, password: user.password, ip: clientIP }, process.env.REFRESH, {
                        expiresIn: '30d',
                    });

                    req.session.access = accessToken;
                    req.session.refresh = refreshToken;
                    res.status(200).redirect('/');
                } else {
                    // Неверный пароль
                    return Exception.NotValidUserNotFaundLogin(res, 'Неверный пароль');
                }
            });

        }
    }
    async registration(req, res) {
        const clientIP = req.ip;
        const errors = validationResult(req);
        console.log(req.body);
        const { lastname, surname, date, role, email, password1, policy } = req.body;

        try {
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации, возвращаем ошибку клиенту
                return res.status(400).json({ message: 'Введены некорректные данные' });
            } else {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    // Если пользователь с таким email уже существует, вернуть ошибку клиенту
                    return res.status(400).json({ message: 'Пользователь с такой почтой уже существует' });
                }

                // Если пользователя с таким email не существует, выполняем регистрацию
                let finded = await emailverefy.findOne({ email });
                if (finded && finded.status === true) {
                    const saltRounds = 10;
                    let id = generaterId()
                    const hashedPassword = await bcrypt.hash(password1, saltRounds);

                    // Создание JWT-токенов для access и refresh

                    const accessToken = jwt.sign({ id, role: req.body.role }, process.env.ACCESS, { expiresIn: '1m' });
                    const refreshToken = jwt.sign({ id, email, password: hashedPassword, ip: clientIP }, process.env.REFRESH, {
                        expiresIn: '30d',
                    });

                    req.session.access = accessToken;
                    req.session.refresh = refreshToken;
                    const token = await new Token({token: refreshToken})
                    await token.save()
                    const newUser = new User({id,  name: surname.toLowerCase(), lastname: lastname.toLowerCase(), date, role, email, password: hashedPassword, policy });
                    await newUser.save();
                    await emailverefy.deleteOne({ email }); // Move this line here
                    return res.status(200).json({ message: 'все верно' });
                } else {
                    return res.status(400).json({ message: 'Почта не подтверждена' });
                }
            }
        } catch (error) {
            console.error(error); // Log the error for debugging purposes
            // Если возникла ошибка при сохранении данных, отправляем ошибку клиенту
            return res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
        }
    }


    async emailVerify(req, res) {
        const { email } = req.body;
        const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return Exception.NotCorrectCode(res, 'Введите корректную почту');
        } else {
            try {
                const codeToDataBase = await new emailverefy({ email, code, status: false });
                await codeToDataBase.save();
                const mailOptions =  {
                    from: 'igorushakov005@gmail.com', // От кого отправляется письмо
                    to: email, // Кому отправляется письмо
                    subject: 'Подтверждение регистрации', // Тема письма
                    html: `<!DOCTYPE html>
                            <html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Подтверждение регистрации</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <div style="background-color: #f1f1f1; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; padding: 20px;">
      <div style="text-align: center;">
       <svg width="131" height="35" viewBox="0 0 131 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.97579 33.6302C0.884577 32.8736 0.61365 31.376 1.37066 30.2851L14.265 11.7039L18.2166 14.4436L5.32231 33.0248C4.5653 34.1157 3.06701 34.3867 1.97579 33.6302Z" fill="#5412E0"/>
<path d="M29.3977 11.3777C29.3977 12.5416 28.4542 13.4851 27.2903 13.4851H21.4869V31.6145C21.4869 32.9329 20.4181 34.0017 19.0997 34.0017C17.7813 34.0017 16.7126 32.9329 16.7126 31.6145V13.4851H10.9092C9.74533 13.4851 8.80182 12.5416 8.80182 11.3777C8.80182 10.2138 9.74533 9.27029 10.9092 9.27029H27.2903C28.4542 9.27029 29.3977 10.2138 29.3977 11.3777Z" fill="#5412E0"/>
<path d="M54.4189 9.27029V31.4196C54.4189 32.7151 53.3687 33.7653 52.0732 33.7653C50.7778 33.7653 49.7276 32.7151 49.7276 31.4196V23.3118H37.1339V31.4025C37.1339 32.7074 36.076 33.7653 34.7711 33.7653C33.4662 33.7653 32.4083 32.7074 32.4083 31.4025V9.27029H37.1339V19.1718H49.7276V9.27029H54.4189Z" fill="#5412E0"/>
<path d="M70.1889 33.9378C68.2484 33.9378 66.5933 33.6158 65.2236 32.9718C63.8767 32.3048 62.7809 31.3963 61.9362 30.2463C61.1144 29.0963 60.5094 27.7968 60.1213 26.3478C59.7332 24.8758 59.5392 23.3463 59.5392 21.7593V9.27029H64.2648V21.7593C64.2648 22.7713 64.3561 23.7603 64.5387 24.7263C64.7442 25.6693 65.0752 26.5203 65.5318 27.2793C65.9883 28.0383 66.5933 28.6363 67.3467 29.0733C68.1 29.5103 69.036 29.7288 70.1546 29.7288C71.2961 29.7288 72.2434 29.5103 72.9968 29.0733C73.773 28.6133 74.3779 28.0038 74.8117 27.2448C75.2683 26.4858 75.5993 25.6348 75.8048 24.6918C76.0102 23.7258 76.1129 22.7483 76.1129 21.7593V9.27029H80.8043V21.7593C80.8043 23.4383 80.5988 25.0138 80.1879 26.4858C79.7998 27.9578 79.172 29.2573 78.3045 30.3843C77.4599 31.4883 76.3641 32.3623 75.0172 33.0063C73.6702 33.6273 72.0608 33.9378 70.1889 33.9378Z" fill="#5412E0"/>
<path d="M88.6503 18.0333V31.4025C88.6503 32.7074 87.5924 33.7653 86.2875 33.7653C84.9825 33.7653 83.9247 32.7074 83.9247 31.4025V9.27029H87.6914L101.259 25.4163V9.30479H105.984V31.0715C105.984 32.5592 104.778 33.7653 103.291 33.7653C102.501 33.7653 101.751 33.419 101.24 32.8179L88.6503 18.0333Z" fill="#5412E0"/>
<path d="M130.193 13.4448H121.853V23.605V31.4196C121.853 32.7151 120.803 33.7653 119.507 33.7653C118.212 33.7653 117.161 32.7151 117.161 31.4196V13.4448H109.104V9.27029H130.193V13.4448Z" fill="#5412E0"/>
<ellipse cx="19.046" cy="3.74602" rx="3.72977" ry="3.73151" transform="rotate(90.25 19.046 3.74602)" fill="#5412E0"/>
</svg>

        <h2 style="color: #5412E0;">Подтверждение регистрации</h2>
      </div>
      <p>Добро пожаловать в ITHunt! Ваш код подтверждения:</p>
      <div style="background-color: #5412E0; color: #ffffff; padding: 10px; text-align: center; font-size: 24px; border-radius: 5px;">
        <strong>Ваш уникальный код: ${code}</strong> <!-- Здесь выводите динамический код подтверждения -->
      </div>
      <p style="margin-top: 20px;">Этот код действует в течение 120 секунд. Пожалуйста, используйте его для завершения
        регистрации.</p>
      <p>Если вы не запрашивали код подтверждения, просто игнорируйте это письмо.</p>
      <p>С уважением,<br>
        Команда ITHunt</p>
    </div>
  </div>
</body>

</html>
`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Ошибка при отправке письма:', error);
                    } else {
                        console.log('Письмо успешно отправлено:', info.response);
                    }
                });
                res.status(200).json({ message:"Письмо отправлено" });

                setTimeout(async () => {
                    try {
                        await emailverefy.deleteOne({ email });
                        console.log('Запись успешно удалена');
                    } catch (error) {
                        console.error('Ошибка при удалении записи:', error);
                    }
                }, 240000);
            } catch (error) {
                return res.status(500).json({ message: 'Код уже отправлен' });
            }
        }
    }

    async verefyCodeOnEmail(req, res) {
        let {email, code} = req.body
        console.log(email,code)
        try {
            let finded = await emailverefy.findOne({ email, code })
            console.log(finded)
            if (finded) {
                await emailverefy.findOneAndUpdate({ email, code }, { $set: { status: true } });
            res.sendStatus(200);
            }
            else {
                res.sendStatus(401)
            }
        } catch (error) {
            // В случае ошибки верификации можно отправить соответствующий статус и сообщение об ошибке
            res.status(500).json({ error: 'Ошибка при верификации кода' });
        }
    }

    async  appendData(req, res) {
        const userId = req.session.passport.user; // Предполагается, что `req.session.passport.user` содержит идентификатор пользователя
        console.log(req.body);
        const updateData = {
            role: req.body.role,
            date: req.body.date,
        };

        try {
            // Находим пользователя по идентификатору и обновляем поля
            const updatedUser = await User.findOneAndUpdate(
                { id: userId },
                updateData,
                { new: true }
            );

            if (updatedUser) {
                // Пользователь найден и успешно обновлен
                console.log('Обновление успешно. Обновленный пользователь:', updatedUser);
                res.status(200).json({ message: 'Обновление успешно' });
            } else {
                // Пользователь с указанным идентификатором не найден
                console.log('Пользователь с указанным идентификатором не найден:', userId);
                res.status(404).json({ message: 'Пользователь не найден' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
        }
    }

}

module.exports = new Auth();
