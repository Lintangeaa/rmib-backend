var express = require("express")
const { addContact, getAllContact } = require("../controllers/learnController")

var router = express.Router()

router.post("/", addContact)
router.get("/", getAllContact)

module.exports = router
