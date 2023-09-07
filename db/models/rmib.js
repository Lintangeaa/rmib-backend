"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Rmib extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  Rmib.init(
    {
      userId: DataTypes.INTEGER,
      result: DataTypes.STRING,
      minat: DataTypes.STRING,
      pertama: DataTypes.STRING,
      kedua: DataTypes.STRING,
      ketiga: DataTypes.STRING,
      keempat: DataTypes.STRING,
      kelima: DataTypes.STRING,
      keenam: DataTypes.STRING,
      ketujuh: DataTypes.STRING,
      kelapan: DataTypes.STRING,
      kesembilan: DataTypes.STRING,
      kesepuluh: DataTypes.STRING,
      kesebelas: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Rmib",
    }
  )
  return Rmib
}
