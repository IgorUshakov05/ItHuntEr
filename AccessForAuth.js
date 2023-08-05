const jwt = require('jsonwebtoken');
const tokenModel = require('./models/refreshTokens'); // Путь к модели токена

const isLoggedIn = async (req, res, next) => {
    const clientIP = req.ip;
    console.log('IP: ', clientIP);
    console.log(typeof req.session.access);

    // Проверяем, существуют ли токены доступа и обновления в сессии
    if (typeof req.session.access === "string" && typeof req.session.refresh === "string") {
        console.log("ITHunt");
        try {
            // Проверяем токен доступа
            const decodedAccess = await jwt.verify(req.session.access, process.env.ACCESS);
            console.log("Декодированный access токен:", decodedAccess);
            next();
        } catch (accessErr) {
            try {
                // Если токен доступа недействителен или истек, проверяем токен обновления
                const decodedRefresh = await jwt.verify(req.session.refresh, process.env.REFRESH);
                console.log("Декодированный refresh токен:", decodedRefresh);

                const foundToken = await tokenModel.findOne({ token: req.session.refresh });
                if (!foundToken) {
                    console.log("Токен не найден в базе данных");
                    req.session.refresh = null;
                    req.session.access = null;
                    return res.redirect('/');
                }

                //Из базы данных
                const decodedRefreshServer = await jwt.verify(foundToken.token, process.env.REFRESH);
                console.log(decodedRefreshServer)
                if (foundToken.ip !== clientIP && foundToken.token !== req.session.refresh) {
                    console.log("Токен не найден в базе данных");
                    req.session.refresh = null;
                    req.session.access = null;
                    return res.redirect('/registration');
                } else {
                    req.session.access = jwt.sign({ id: decodedRefreshServer.id, role: decodedRefreshServer.role }, process.env.ACCESS, { expiresIn: '1m' });
                    console.log("Выдан новый токен")
                }

                next();
            } catch (refreshErr) {
                console.log("Ошибка при расшифровке refresh токена:", refreshErr);
                req.session.refresh = null;
                if (typeof req.session.refresh === 'string') {
                    const foundToken = await tokenModel.findOneAndDelete({ token: req.session.refresh });
                    console.log(foundToken)
                }
                req.session.access = null;
                return res.redirect('/registration');
            }
        }
    } else if (req.session.passport) {
        // Аутентификация через Google
        console.log("Google: ", req.session.passport);
        next();
    } else {
        // Сессия не содержит токенов доступа и обновления, рассматриваем как неаутентифицированную
        console.log("Не авторизован");
        next();
    }
};

module.exports = isLoggedIn;