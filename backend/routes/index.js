var express = require('express');
var router = express.Router();
const conducteurCtrl = require('../controllers/conducteur-Ctrl')
// const auth = require('../middleware/auth')


router.post('/register', conducteurCtrl.register);
router.get('/activateAccount/:token', conducteurCtrl.activateAccount)
router.post('/login', conducteurCtrl.Login);
router.get('/allconducteur', conducteurCtrl.getAllConducteur)
router.get('/getconducteur/:id', conducteurCtrl.getConducteurById)




module.exports = router;