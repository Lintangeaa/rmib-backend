var express = require('express');

const auth = require('../app/middlewares/auth');
const { isMahasiswa } = require('../app/middlewares/rbac');
const {
  saveResult,
  getAllRmib,
  getByUserId,
} = require('../app/controllers/rmibController');

var router = express.Router();

router.post('/', auth, isMahasiswa, saveResult);
router.get('', getAllRmib);
router.get('/:userId', getByUserId);

module.exports = router;
