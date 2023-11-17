var express = require('express');

const auth = require('../app/middlewares/auth');
const {
  Register,
  getAllUsers,
  getAllMahasiswa,
  deleteUsers,
  getMahasiswaById,
  softDelete,
  updateMahasiswa,
  resetPassword,
} = require('../app/controllers/userController');
const { isAdmin, isMahasiswa } = require('../app/middlewares/rbac');

var router = express.Router();

router.get('/', auth, isAdmin, getAllUsers);
router.post('/', Register);
router.put('/deactive', softDelete);
router.put('/reset-password/:id', auth, isAdmin, resetPassword);

router.get('/mahasiswa', auth, isAdmin, getAllMahasiswa);
router.get('/mahasiswa/:id', getMahasiswaById);
router.put('/mahasiswa/:id', auth, isAdmin, updateMahasiswa);

module.exports = router;
