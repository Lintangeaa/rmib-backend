const Joi = require('joi');

const { User, Mahasiswa } = require('../../db/models');

const usernameExist = async (e) => {
  const data = await User.findOne({
    where: {
      username: e,
    },
  });
  if (data) {
    throw new Error('Email already exists');
  }
};

const emailExist = async (e) => {
  const data = await User.findOne({
    where: {
      email: e,
    },
  });
  if (data) {
    throw new Error('Email already exists');
  }
};

const nimExist = async (e) => {
  const data = await Mahasiswa.findOne({
    where: {
      nim: e,
    },
  });
  if (data) {
    throw new Error('NIM already exists');
  }
};

const userSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(255)
    .required()
    .external(usernameExist)
    .messages({
      'string.empty': 'Username tidak boleh kosong',
      'any.required': 'Username diperlukan',
    }),
  email: Joi.string().email().required().external(emailExist).messages({
    'string.empty': 'Email tidak boleh kosong',
  }),
  password: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Password tidak boleh kosong',
  }),
  role: Joi.string().required(),
});

const mahasiswaSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Nama tidak boleh kosong',
  }),
  nim: Joi.string().required().external(nimExist).messages({
    'string.empty': 'NIM tidak boleh kosong',
  }),
  gender: Joi.string().required().messages({
    'string.empty': 'Gender tidak boleh kosong',
  }),
  prodi: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Prodi tidak boleh kosong',
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Nomor HP tidak boleh kosong',
  }),
});

module.exports = {
  userSchema,
  mahasiswaSchema,
};
