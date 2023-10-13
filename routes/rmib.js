var express = require('express');

const auth = require('../middlewares/auth');
const {
  saveResult,
  getByUserId,
  getAllRmib,
  deleteRmib,
} = require('../controllers/rmibController');

var router = express.Router();

router.post('/', auth, saveResult);
router.get('/', auth, getAllRmib);
router.get('/:userId', auth, getByUserId);
router.delete('/:id', auth, deleteRmib);

module.exports = router;
