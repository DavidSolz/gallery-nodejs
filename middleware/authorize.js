module.exports = function isAdmin(req, res, next) {
  if (res.locals.loggedUser && res.locals.loggedUser === 'admin') {
    next();
  } else {
    res.render('index', {
      title: 'Gallery App',
      messages: ['Access denied. Admins only.']
    });
  }
};
