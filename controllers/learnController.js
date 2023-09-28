const { Contact } = require("../db/models")
const catchAsync = require("../utils/catchAsync")

module.exports = {
  getAllContact: catchAsync(async (req, res) => {
    const data = await Contact.findAll()

    if (data.length == 0) {
      res.status(200).json({
        status: false,
        message: "Data tidak ada!",
      })
    }

    res.status(200).json({
      status: true,
      data,
    })
  }),
  addContact: catchAsync(async (req, res) => {
    const { name, email, subject, message } = req.body

    const data = await Contact.create({
      name,
      email,
      subject,
      message,
    })

    res.status(200).json({
      status: true,
      message: "Pesan anda berhasil dikirim",
      data: { data },
    })
  }),
}
