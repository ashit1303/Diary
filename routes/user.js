//ROUTES THROUGHOUT YOUR WEBSITE

const router = require('express').Router();

const userController = require('../controllers/user');
const { ensureGuest, ensureAuthenticated } = require('../libs/auth');

/* *** GET ENDPOINTS *** */

router.get('/login', ensureGuest, userController.login);
router.get('/register', ensureGuest, userController.register);
router.get('/logout', ensureAuthenticated, userController.logout);
router.get('/main', ensureAuthenticated, userController.secret);
router.get('/entrysaved', ensureAuthenticated, userController.saved);

/* *** POST ENDPOINTS *** */
router.post('/register', userController.postRegister);
router.post('/verifyemail', userController.verOtp);
router.post('/login', userController.postLogin);
router.post('/save', userController.postSave);
router.post('/sendotp',userController.genotp);
router.post('/resetpass', userController.passreset);
router.post('/gotodate', userController.show);
/*router.post('/updateProfile', userController.postDet);  

*/


// finish -> export
module.exports = router;
