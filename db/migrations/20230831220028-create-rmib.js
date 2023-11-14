'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rmibs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      result: {
        type: Sequelize.STRING,
      },
      minat: {
        type: Sequelize.STRING,
      },
      pertama: {
        type: Sequelize.STRING,
      },
      kedua: {
        type: Sequelize.STRING,
      },
      ketiga: {
        type: Sequelize.STRING,
      },
      keempat: {
        type: Sequelize.STRING,
      },
      kelima: {
        type: Sequelize.STRING,
      },
      keenam: {
        type: Sequelize.STRING,
      },
      ketujuh: {
        type: Sequelize.STRING,
      },
      kelapan: {
        type: Sequelize.STRING,
      },
      kesembilan: {
        type: Sequelize.STRING,
      },
      kesepuluh: {
        type: Sequelize.STRING,
      },
      kesebelas: {
        type: Sequelize.STRING,
      },
      keduabelas: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rmibs');
  },
};
