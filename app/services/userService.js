const { User, Mahasiswa } = require('../../db/models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { userSchema } = require('../util/validator');

async function createUser({ username, email, password, role }) {
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await User.create({
      id: userId,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return { success: true, message: 'User created', data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function createMahasiswa({
  username,
  email,
  password,
  role,
  name,
  nim,
  gender,
  prodi,
  phone,
}) {
  const user = await createUser({ username, email, password, role });

  if (!user.success) {
    return { success: false, error: user.error };
  } else {
    try {
      const data = await Mahasiswa.create({
        id: user.data.id,
        userId: user.data.id,
        name,
        nim,
        gender,
        prodi,
        phone,
      });
      return { success: true, data: data };
    } catch (error) {
      await User.destroy({ where: { id: user.data.id } });
      console.log(error);
      return { succes: false, error: error.message };
    }
  }
}

async function deleteUser(userId) {
  try {
    await User.destroy({
      where: {
        id: userId,
      },
    });
    await Mahasiswa.destroy({
      where: {
        userId: userId,
      },
    });

    return { success: true, message: 'Success delete user' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getAllUser({ whereCondition, page, limit, additional }) {
  const offset = (page - 1) * limit;
  try {
    const data = await User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
      additional,
    });

    return {
      success: true,
      data: data,
      count: data.count,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateUser({ id, email, name, nim, prodi, phone }) {
  try {
    await Mahasiswa.update(
      {
        name,
        nim,
        prodi,
        phone,
      },
      {
        where: {
          userId: id,
        },
      },
    );
    await User.update(
      {
        email,
      },
      {
        where: { id: id },
      },
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  createUser,
  createMahasiswa,
  getAllUser,
  deleteUser,
  updateUser,
};
