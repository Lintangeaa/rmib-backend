var express = require('express');

const auth = require('../app/middlewares/auth');
const {
  Register,
  getAllUsers,
  getAllMahasiswa,
  deleteUsers,
} = require('../app/controllers/userController');

var router = express.Router();

router.get('/', getAllUsers);
router.post('/', Register);
router.delete('/', deleteUsers);

router.get('/mahasiswa', getAllMahasiswa);

module.exports = router;
