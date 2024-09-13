/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: true,
        set(val) {
          this.setDataValue("email", val.toLowerCase());
        },
      },
      username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        set(val) {
          this.setDataValue("username", val.toLowerCase());
        },
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      school_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      school_department: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      linked_in_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      github_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
