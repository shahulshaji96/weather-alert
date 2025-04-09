module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Alerts', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        alertType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Alerts');
    },
  };
  