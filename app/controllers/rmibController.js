const { Rmib, User, Mahasiswa } = require('../../db/models');
const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const { v4: uuidv4 } = require('uuid');

const Schema = Joi.object({
  result: Joi.string().required(),
  minat: Joi.string().required(),
});

exports.saveResult = catchAsync(async (req, res) => {
  const userId = req.user.id;

  try {
    const { result, minat } = req.body;

    await Schema.validateAsync(req.body, { abortEarly: false });

    const data = await Rmib.create({
      id: uuidv4(),
      userId: userId,
      result,
      minat,
    });

    res.status(200).json({
      status: true,
      message: 'Data berhasil disimpan',
      data,
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
});

exports.getByUserId = catchAsync(async (req, res) => {
  try {
    const { userId } = req.params; // Corrected destructuring
    const data = await Rmib.findOne({
      where: {
        userId: userId,
      },
    });

    if (!data) {
      return res.status(200).json({
        status: false,
        message: 'Data tidak ditemukan',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Ada nih',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

exports.getAllRmib = catchAsync(async (req, res) => {
  try {
    const data = await Rmib.findAll({
      include: {
        model: Mahasiswa,
        attribute: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: {
          model: User,
        },
      },
    });

    if (data.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Data ditemukan',
        data: {
          data,
          count: data.length,
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: 'Data Kosong',
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: error.message,
    });
  }
});
