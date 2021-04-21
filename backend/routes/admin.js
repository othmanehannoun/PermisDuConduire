var express = require('express');
const { route } = require('.');
var router = express.Router();
const adminCtrl = require('../controllers/admin-Ctrl')
// const auth = require('../middleware/auth')


router.post('/register', adminCtrl.register);
router.post('/login', adminCtrl.Login);
router.put('/updateConducteur/:id', adminCtrl.updateConducteur);




module.exports = router;