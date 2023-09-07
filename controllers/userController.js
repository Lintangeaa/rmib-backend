const { User, Mahasiswa } = require("../db/models")
const Joi = require("joi")
const bcrypt = require("bcrypt")

const emailExist = async (e) => {
  const data = await User.findOne({
    where: {
      email: e,
    },
  })
  if (data) {
    throw new Error("Email already exists")
  }
}

const Schema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required().external(emailExist),
  password: Joi.string().min(3).max(255).required(),
  role: Joi.string().required(),
  name: Joi.string(),
  nim: Joi.string(),
  prodi: Joi.string(),
  phone: Joi.string(),
})

module.exports = {
  Register: async (req, res) => {
    const { username, email, password, role, name, nim, prodi, phone } =
      req.body
    try {
      await Schema.validateAsync(req.body, { abortEarly: false })
      const hashPassword = await bcrypt.hash(password, 10)
      let data

      if (role === "admin") {
        data = await User.create({
          username,
          email,
          password: hashPassword,
          role,
        })
      } else if (role === "mahasiswa") {
        const user = await User.create({
          username,
          email,
          password: hashPassword,
          role,
        })

        data = await Mahasiswa.create({
          userId: user.id,
          name,
          nim,
          prodi,
          phone,
        })

        const userData = await User.findOne({ where: { id: user.id } })

        data = {
          ...data.toJSON(),
          user: userData.toJSON(),
        }
      }

      res.status(200).json({
        status: true,
        message: "Registration Successful",
        data,
      })
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      })
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await User.findAll()

      if (!data) {
        res.status(200).json({
          status: false,
          message: "User tidak ditemukan",
        })
      }

      res.status(200).json({
        status: true,
        data,
      })
    } catch (error) {
      res.status(200).json({
        status: false,
        message: error.message,
      })
    }
  },
  getAllMahasiswa: async (req, res) => {
    try {
      const data = await Mahasiswa.findAll({
        include: {
          model: User,
          attributes: ["username", "email", "role"],
        },
      })

      if (!data) {
        res.status(200).json({
          status: false,
          message: "User tidak ditemukan",
        })
      }

      res.status(200).json({
        status: true,
        data,
      })
    } catch (error) {
      res.status(200).json({
        status: false,
        message: error.message,
      })
    }
  },
  getMahasiswaById: async (req, res) => {
    try {
      const { userId } = req.params

      const data = await Mahasiswa.findOne({
        where: {
          userId: userId,
        },
      })

      if (!data) {
        res.status(200).json({
          status: false,
          message: "Data Mahasiswa tidak ditemukan",
        })
      }
      res.status(200).json({
        status: true,
        message: "Data ada",
        data,
      })
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      })
    }
  },
}
