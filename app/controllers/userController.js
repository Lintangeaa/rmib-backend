const Joi = require('joi');
const bcrypt = require('bcrypt');
const catchAsync = require('../util/catchAsync');
const { Op } = require('sequelize');
const {
  createUser,
  createMahasiswa,
  getAllUser,
  deleteUser,
} = require('../services/userService');
const { User, Mahasiswa } = require('../../db/models');

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

const userSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required().external(emailExist),
  password: Joi.string().min(3).max(255).required(),
  role: Joi.string().required(),
});

exports.Register = catchAsync(async (req, res) => {
  const { username, email, password, role, name, nim, prodi, phone } = req.body;

  if (role == 'admin') {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    const result = await createUser({ username, email, password, role });

    if (result.success) {
      res.status(201).json({
        status: true,
        message: 'Admin Created!',
        data: result.data,
      });
    } else {
      res.status(400).json({
        status: false,
        message: result.error,
      });
    }
  } else {
    const result = await createMahasiswa({
      username,
      email,
      password,
      role,
      name,
      nim,
      prodi,
      phone,
    });
    if (result.success) {
      res.status(201).json({
        status: true,
        message: 'Mahasiswa Created!',
        data: result.data,
      });
    } else {
      res.status(400).json({
        status: false,
        message: result.error,
      });
    }
  }
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, username = '' } = req.query;
  const whereCondition = {};
  if (username) {
    whereCondition['$username$'] = { [Op.like]: `%${username}%` };
  }
  const user = await getAllUser({ whereCondition, page, limit });

  if (user.success) {
    res.status(200).json({
      status: true,
      currentPage: page,
      totalItems: user.data.count,
      totalPage: Math.ceil(user.data.count / limit),
      message: 'Success get all users!',
      data: user.data.rows,
    });
  } else {
    res.status(400).json({
      status: false,
      message: user.error,
    });
  }
});

exports.getAllMahasiswa = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, name = '', nim = '' } = req.query;
  const offset = (page - 1) * limit;
  const whereCondition = { role: 'mahasiswa' };

  if (name) {
    whereCondition['$Mahasiswa.name$'] = { [Op.like]: `%${name}%` };
  } else if (nim) {
    whereCondition['$Mahasiswa.nim$'] = { [Op.like]: `%${nim}%` };
  }

  const users = await User.findAndCountAll({
    include: [
      { model: Mahasiswa, attributes: ['name', 'nim', 'prodi', 'phone'] },
    ],
    limit: parseInt(limit),
    offset: offset,
    where: whereCondition,
  });
  if (users.rows.length <= 0) {
    return res.status(404).json({
      status: false,
      message: 'Data not found!',
    });
  } else {
    const data = users.rows.map((e) => {
      return {
        id: e.id,
        username: e.username,
        email: e.email,
        nama: e.Mahasiswa.name,
        nim: e.Mahasiswa.nim,
        prodi: e.Mahasiswa.prodi,
        phone: e.Mahasiswa.phone,
      };
    });

    res.status(200).json({
      status: true,
      message: 'Success All Mahasiswa',
      currentPage: page,
      totalItems: users.count,
      totalPages: Math.ceil(users.count / limit),
      data,
    });
  }
});

exports.deleteUsers = catchAsync(async (req, res) => {
  const { id } = req.query;

  console.log(id);
  const result = await deleteUser(id);
  if (result.success) {
    res.status(200).json({
      status: true,
      message: result.message,
    });
  } else {
    res.status(400).json({
      status: false,
      message: result.error,
    });
  }
});
