const express = require('express');
const exceptionHandler = require("../Exception");
const path = require("path");
const isLoggedIn = require('../AccessForAuth')
const {header} = require('./headerInfo')
const tokenModel = require("../models/refreshTokens");
const router = express.Router();
router.get('/', (req, res) => {
    const userData = header(req.session)
    console.log(userData)
    res.render('index', userData);
});
router.get('/myProfile', isLoggedIn,(req,res) => {
    const userData = header(req.session)
    if (userData.isLoggedIn) {
        res.render('myprofile',userData)

    }else {
        res.redirect('/login')
    }

})

router.get('/more', (req,res) => {
    try {
    const session = req.session.passport.user
    console.log(session)
    }
    catch (e) {
        res.redirect('/login')
    }
    res.render('moredata')
})

router.get('/user/:id', (req,res) => {
    const userData = header(req.session)
    res.render('userprofile', userData)
})
router.get('/specialists', (req, res) => {
    const userData = header(req.session)
    res.render('specialist', userData);
});

router.get('/login', async (req,res) => {
    if (typeof req.session.refresh === 'string') {
        const foundToken = await tokenModel.findOneAndDelete({ token: req.session.refresh });
        console.log(foundToken)
    }
    req.logout()
    req.session = null;
    // Удаляем куки из ответа (если используем cookie-session)
    res.clearCookie('session');
    res.render('login')
})

router.get('/vacancies', (req, res) => {
    const userData = header(req.session)
    res.render('vacancies', userData);
});

router.get('/chats', isLoggedIn,(req, res) => {
    const userData = header(req.session)
    if (userData.isLoggedIn) {
        res.render('chats',userData)

    }else {
        res.redirect('/login')
    }
});

router.get('/fast-work', (req, res) => {
    const userData = header(req.session)
    res.render('fast-work', userData);
});

router.get('/registration', async(req, res) => {
    if (typeof req.session.refresh === 'string') {
        const foundToken = await tokenModel.findOneAndDelete({ token: req.session.refresh });
        console.log(foundToken)
    }
    req.logout()
    req.session = null;
    // Удаляем куки из ответа (если используем cookie-session)
    res.clearCookie('session');
    await res.render('registration');
});
router.get('/robots.txt', (req, res) => {
    const robotsFilePath = path.join(__dirname, '../robots.txt');
    res.sendFile(robotsFilePath);
});

// router.get('*', (req, res) => {
//     exceptionHandler.PageNotFound(res);
// });

module.exports = router;