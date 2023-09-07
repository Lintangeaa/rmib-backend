const { Rmib, User, Mahasiswa } = require("../db/models")
const Joi = require("joi")
const catchAsync = require("../utils/catchAsync")

const userIdExist = async (e) => {
  const data = await Rmib.findOne({
    where: {
      userId: e,
    },
  })
  if (data) {
    throw new Error("Anda sudah melakukan test")
  }
}

const Schema = Joi.object({
  userId: Joi.number().required().external(userIdExist),
  result: Joi.string().required(),
  minat: Joi.string().required(),
  pertama: Joi.string().required(),
  kedua: Joi.string().required(),
  ketiga: Joi.string().required(),
  keempat: Joi.string().required(),
  kelima: Joi.string().required(),
  keenam: Joi.string().required(),
  ketujuh: Joi.string().required(),
  kelapan: Joi.string().required(),
  kesembilan: Joi.string().required(),
  kesepuluh: Joi.string().required(),
  kesebelas: Joi.string().required(),
  keduabelas: Joi.string().required(),
})

module.exports = {
  saveResult: async (req, res) => {
    try {
      const {
        userId,
        result,
        minat,
        pertama,
        kedua,
        ketiga,
        keempat,
        kelima,
        keenam,
        ketujuh,
        kelapan,
        kesembilan,
        kesepuluh,
        kesebelas,
        keduabelas,
      } = req.body

      await Schema.validateAsync(req.body, { abortEarly: false })

      const data = await Rmib.create({
        userId,
        result,
        minat,
        pertama,
        kedua,
        ketiga,
        keempat,
        kelima,
        keenam,
        ketujuh,
        kelapan,
        kesembilan,
        kesepuluh,
        kesebelas,
        keduabelas,
      })

      res.status(200).json({
        status: true,
        message: "Data berhasil disimpan",
        data,
      })
    } catch (error) {
      res.status(200).json({
        status: false,
        message: error.message,
      })
    }
  },
  getByUserId: async (req, res) => {
    try {
      const { userId } = req.params // Corrected destructuring
      const data = await Rmib.findOne({
        where: {
          userId: userId,
        },
      })

      if (!data) {
        return res.status(200).json({
          status: false,
          message: "Data tidak ditemukan",
        })
      }

      res.status(200).json({
        status: true,
        message: "Ada nih",
        data,
      })
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      })
    }
  },
  getAllRmib: catchAsync(async (req, res) => {
    const data = await Rmib.findAll({
      include: {
        model: User,
        attributes: ["id", "username", "email", "role"],
        include: {
          model: Mahasiswa,
          // Menyesuaikan dengan kunci yang digunakan dalam tabel Mahasiswa
        },
      },
    })

    if (data.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Ana kie",
        data,
      })
    } else {
      res.status(200).json({
        status: false,
        message: "Data Kosong",
      })
    }
  }),
}
