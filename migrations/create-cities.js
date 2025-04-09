module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'Cities' table
    await queryInterface.createTable("Cities", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Set this as the primary key
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // City name is required
        unique: true, // Ensure each city is only added once
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Automatically set timestamp when city is added
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the 'Cities' table if the migration is rolled back
    await queryInterface.dropTable("Cities");
  },
};
