const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.cookies.mytoken;
    if (!token) {
        res.locals.loggedUser = null;
        return res.render('index', {
            title: 'Gallery App'
        });
    }

    try {
        const decoded = jwt.verify(token, 'tutajJakisKlucz');
        res.locals.loggedUser = decoded.username;
    } catch (err) {
        res.locals.loggedUser = null;
    }

    next();
}
module.exports = authenticate
