var express = require('express');
const { login, whoAmi } = require('../app/controllers/authController');
const auth = require('../app/middlewares/auth');

var router = express.Router();

router.get('/me', auth, whoAmi);
router.post('/login', login);

module.exports = router;
