const { User } = require('../db/models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

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
    });
    if (!data) {
      return res.status(200).json({
        status: false,
        message: 'Pengguna tidak ditemukan',
      });
    } else {
      const isPasswordValid = bcrypt.compareSync(password, data.password);

      if (!isPasswordValid) {
        return res.status(200).json({
          status: false,
          message: 'Email or Password incorect',
        });
      } else {
        const payload = {
          id: data.id,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        };

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1m' });

        res.status(200).json({
          status: true,
          message: 'Login Berhasil',

          token,
          payload,
        });
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
