var express = require("express")

const auth = require("../middlewares/auth")
const {
  saveResult,
  getByUserId,
  getAllRmib,
} = require("../controllers/rmibController")

var router = express.Router()

router.post("/", saveResult)
router.get("", getAllRmib)
router.get("/:userId", getByUserId)

module.exports = router
