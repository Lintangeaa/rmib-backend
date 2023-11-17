'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasOne(models.Rmib, { foreignKey: 'userId' });
    }
  }
  Mahasiswa.init(
    {
      userId: DataTypes.STRING,
      name: DataTypes.STRING,
      nim: DataTypes.STRING,
      gender: DataTypes.ENUM(['laki-laki', 'perempuan']),
      prodi: DataTypes.STRING,
      phone: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Mahasiswa',
    },
  );
  return Mahasiswa;
};
