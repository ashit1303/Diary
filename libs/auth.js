module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()){
      return next();
  }
    else{
      res.redirect('/');
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated())
      res.redirect('main');
    else
      return next();
  }
}
