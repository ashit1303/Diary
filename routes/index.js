//FOR HOME PAGE 

//CHANGE LINK FOR DEFAULT IP AND PORT
const link='sabutils.herokuapp.com'
const router = require('express').Router();
const userController = require('../controllers/user');
const { ensureGuest, ensureAuthenticated } = require('../libs/auth');



// basics routes
router.get('/',ensureGuest, (req, res) => {
  res.render('index', {link});
});

module.exports = router;
