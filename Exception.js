class Exception {
    PageNotFound(res) {
        res.render('error');
    }
    NotValidUserNotFaundLogin(res, errorMessage) {
        res.status(400).json({ message: errorMessage });
    }
    NotCorrectCode(res, errorMessage) {
        res.status(400).json({ error: errorMessage });
    }
    ErrorSaveData(res) {
        res.status(500).json({ error: 'Произошла ошибка при сохранении данных' });
    }
}

module.exports = new Exception();
