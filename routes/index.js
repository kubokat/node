var express = require('express');
var router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin= require('../controllers/admin');

router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendMail);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.checkUser);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.setCounter);
router.post('/admin/upload', ctrlAdmin.uploadFile);

module.exports = router;
