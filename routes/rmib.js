var express = require('express');

const auth = require('../app/middlewares/auth');
const {
  saveResult,
  getAllRmib,
  getByUserId,
} = require('../app/controllers/rmibController');

var router = express.Router();

router.post('/', saveResult);
router.get('', getAllRmib);
router.get('/:userId', getByUserId);

module.exports = router;
