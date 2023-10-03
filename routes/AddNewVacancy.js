const vacancy = require('../models/vakans')


async function setNewVacancy(req,res) {
    const {title,date} = req.body
    console.log(title, date)
}