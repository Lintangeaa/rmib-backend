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
  username: Joi.string().min(3).max(255).required().external(usernameExist),
  email: Joi.string().email().required().external(emailExist),
  password: Joi.string().min(3).max(255).required(),
  role: Joi.string().required(),
});

const mahasiswaSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  nim: Joi.string().required().external(nimExist),
  gender: Joi.string().required(),
  prodi: Joi.string().min(3).max(255).required(),
  phone: Joi.string().required(),
});

module.exports = {
  userSchema,
  mahasiswaSchema,
};
