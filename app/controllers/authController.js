const { User, Mahasiswa } = require('../../db/models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../util/catchAsync');

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const validation = loginSchema.validate({ email, password });
    if (validation.error) {
      return res.status(400).json({
        status: false,
        message: 'Masukan email dan password!',
      });
    }
    const data = await User.findOne({
      where: {
        email: email,
      },
      include: [{ model: Mahasiswa }],
    });
    if (!data) {
      return res.status(404).json({
        status: false,
        message: 'Pengguna tidak ditemukan',
      });
    } else if (data.status != 'aktif') {
      return res.status(404).json({
        status: false,
        message: 'Akun anda tidak aktif',
      });
    } else {
      const isPasswordValid = bcrypt.compareSync(password, data.password);

      if (!isPasswordValid) {
        return res.status(200).json({
          status: false,
          message: 'Password Salah',
        });
      } else {
        if (data.role == 'admin') {
          const payload = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
          };

          const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h' });

          res.status(200).json({
            status: true,
            message: 'Login Berhasil',
            token,
            payload,
          });
        } else {
          const payload = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
            name: data.Mahasiswa?.name ?? null,
            nim: data.Mahasiswa?.nim ?? null,
            gender: data.Mahasiswa?.gender ?? null,
            prodi: data.Mahasiswa?.prodi ?? null,
            phone: data.Mahasiswa?.phone ?? null,
          };

          const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '3h' });

          res.status(200).json({
            status: true,
            message: 'Login Berhasil',
            token,
            payload,
          });
        }
      }
    }
  }),
  whoAmi: async (req, res) => {
    try {
      const user = req.user;

      res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error getting user information',
      });
    }
  },
};
