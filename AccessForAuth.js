const isLoggedIn = (req,res,next) =>{
    let token = req.sesion.session
    console.log(token)
    if (!token) {
        res.redirect('/registration')
    }
    else {
        return false
    }
    next()
}

module.exports = isLoggedIn