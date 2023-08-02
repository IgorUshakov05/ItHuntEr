const express = require('express');
const exceptionHandler = require("../Exception");
const path = require("path");
const isLoggedIn = require('../AccessForAuth')
const router = express.Router();
router.get('/', (req, res) => {
    res.render('index', { isLoggedIn: false, username: 'Ушаков Игорь' });
});
router.get('/myProfile', isLoggedIn,(req,res) => {
    res.render('myprofile')
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
    res.render('userprofile', { isLoggedIn: false, username: 'Ушаков Игорь', user: req.params.id })
})
router.get('/specialists', (req, res) => {
    res.render('specialist', { isLoggedIn: false, username: 'Ушаков Игорь' });
});

router.get('/login', (req,res) => {
    req.logout()
    req.session = null;

    // Удаляем куки из ответа (если используем cookie-session)
    res.clearCookie('session');
    res.render('login')
})

router.get('/vacancies', (req, res) => {
    res.render('vacancies', { isLoggedIn: false, username: "none" });
});

router.get('/chats', isLoggedIn,(req, res) => {
    res.render('chats', { isLoggedIn: false, username: 'Ушаков Игорь' });
});

router.get('/fast-work', (req, res) => {
    res.render('fast-work', { isLoggedIn: false, username: 'Ушаков Игорь' });
});

router.get('/registration', (req, res) => {
    req.logout()
    req.session = null;

    // Удаляем куки из ответа (если используем cookie-session)
    res.clearCookie('session');
    res.render('registration');
});
router.get('/robots.txt', (req, res) => {
    const robotsFilePath = path.join(__dirname, '../robots.txt');
    res.sendFile(robotsFilePath);
});

// router.get('*', (req, res) => {
//     exceptionHandler.PageNotFound(res);
// });

module.exports = router;