const { Contact } = require("../db/models")
const catchAsync = require("../utils/catchAsync")

module.exports = {
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
