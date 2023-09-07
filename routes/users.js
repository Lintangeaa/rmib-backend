var express = require("express")
const {
  Register,
  getAll,
  getAllMahasiswa,
  getMahasiswaById,
} = require("../controllers/userController")
const { login, whoAmi } = require("../controllers/authController")
const auth = require("../middlewares/auth")

var router = express.Router()

/* GET users listing. */
router.get("/", auth, getAll)
router.get("/mahasiswa", getAllMahasiswa)
router.get("/mahasiswa/:userId", auth, getMahasiswaById)

router.get("/me", auth, whoAmi)

router.post("/", Register)

module.exports = router
