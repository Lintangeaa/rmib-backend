const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const catchAsync = require('../util/catchAsync');
const { Op, where } = require('sequelize');
const {
  createUser,
  createMahasiswa,
  getAllUser,
  deleteUser,
  updateUser,
} = require('../services/userService');
const { User, Mahasiswa, Rmib } = require('../../db/models');
const { userSchema, mahasiswaSchema } = require('../util/validator');

exports.Register = catchAsync(async (req, res) => {
  const { username, email, password, role, name, nim, gender, prodi, phone } =
    req.body;

  await userSchema.validateAsync(
    { username, email, password, role },
    { abortEarly: false },
  );

  if (role == 'admin') {
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
    await mahasiswaSchema.validateAsync(
      { name, nim, gender, prodi, phone },
      { abortEarly: false },
    );
    const result = await createMahasiswa({
      username,
      email,
      password,
      role,
      name,
      nim,
      gender,
      prodi,
      phone,
    });
    if (result.success) {
      res.status(201).json({
        status: true,
        message: 'Registrasi Berhasil',
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
  }
  if (nim) {
    whereCondition['$Mahasiswa.nim$'] = { [Op.like]: `%${nim}%` };
  }

  const users = await User.findAndCountAll({
    include: [
      {
        model: Mahasiswa,
        attributes: ['name', 'nim', 'prodi', 'phone', 'gender'],
      },
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
        status: e.status,
        name: e.Mahasiswa.name,
        nim: e.Mahasiswa.nim,
        gender: e.Mahasiswa.gender,
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

exports.downloadAllMahasiswaExcel = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const whereCondition = { role: 'mahasiswa' };

  const users = await User.findAndCountAll({
    include: [
      {
        model: Mahasiswa,
        attributes: ['name', 'nim', 'prodi', 'phone', 'gender'],
        include: [{ model: Rmib, attributes: ['result', 'minat'] }],
      },
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
    const datas = users.rows.map((e, index) => {
      return {
        no: index + 1,
        username: e.username,
        email: e.email,
        status: e.status,
        name: e.Mahasiswa.name,
        nim: e.Mahasiswa.nim,
        gender: e.Mahasiswa.gender,
        prodi: e.Mahasiswa.prodi,
        phone: e.Mahasiswa.phone,
        minat: e.Mahasiswa.Rmib?.minat ?? 'belum test',
        hasil: (() => {
          try {
            const resultArray = JSON.parse(e.Mahasiswa.Rmib?.result);
            return Array.isArray(resultArray)
              ? resultArray
                  .map((item, innerIndex) => `${innerIndex + 1}.${item}`)
                  .join(', ')
              : 'belum test';
          } catch (error) {
            return 'belum test';
          }
        })(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(datas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Opportunity');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Opportunity.xlsx',
    );

    res.write(buffer, 'binary');
    res.end(null, 'binary');
  }
});

exports.getMahasiswaById = catchAsync(async (req, res) => {
  const whereCondition = { role: 'mahasiswa', id: req.params.id };

  const user = await User.findOne({
    include: [
      {
        model: Mahasiswa,
        attributes: ['name', 'nim', 'prodi', 'phone', 'gender'],
        include: [
          {
            model: Rmib,
          },
        ],
      },
    ],
    where: whereCondition,
  });
  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'Data not found!',
    });
  } else {
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      name: user.Mahasiswa.name,
      nim: user.Mahasiswa.nim,
      gender: user.Mahasiswa.gender,
      prodi: user.Mahasiswa.prodi,
      phone: user.Mahasiswa.phone,
      rmib: user.Mahasiswa.Rmib,
    };

    res.status(200).json({
      status: true,
      message: 'Success Get Mahasiswa',
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

exports.softDelete = catchAsync(async (req, res) => {
  const { id } = req.query;

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    res.status(404).json({ status: false, message: 'User not found!' });
  } else {
    const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';

    await User.update(
      { status: newStatus },
      {
        where: {
          id: id,
        },
      },
    );

    res.status(200).json({ status: true, message: 'Success update status' });
  }
});

exports.updateMahasiswa = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { email, name, nim, prodi, phone } = req.body;

  const data = await Mahasiswa.findOne({
    where: {
      userId: id,
    },
  });

  if (!data) {
    res.status(404).json({
      status: false,
      message: 'Mahasiswa tidak ditemukan!',
    });
  } else {
    const result = await updateUser({ id, email, name, nim, prodi, phone });

    if (result.success) {
      res.status(200).json({
        status: true,
        message: 'Mahasiswa berhasil diupdate',
      });
    } else {
      res.status(400).json({
        status: false,
        message: result.error,
      });
    }
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    res.status(404).json({
      status: false,
      message: 'User tidak ditemukan',
    });
  } else {
    const hashedPassword = await bcrypt.hash(user.username, 10);
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: user.id,
        },
      },
    );

    res.status(200).json({
      status: true,
      message: 'Password berhasil di reset',
    });
  }
});

exports.updateUser = catchAsync(async (req, res) => {
  const id = req.user.id;
  const { email, username, newPassword, oldPassword } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User tidak ditemukan',
    });
  } else {
    if (newPassword && oldPassword) {
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ email, username, password: hashedPassword });

        return res.status(200).json({
          status: true,
          message: 'Update profile berhasil',
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Password lama salah',
        });
      }
    } else {
      await user.update({ username: username, email: email });

      return res.status(200).json({
        status: true,
        message: 'Update profile berhasil',
      });
    }

    return res.status(200).json({ user, passwordMatch });
  }
});
