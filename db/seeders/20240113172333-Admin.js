'use strict';

const { createUser } = require('../../app/services/userService');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = {
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin#',
      role: 'admin',
    };
    await createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
