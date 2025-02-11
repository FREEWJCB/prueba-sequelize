'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('relations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Valor por defecto para la columna `active`
      },
      tableId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tables', // Nombre de la tabla a la que se hace referencia
          key: 'id', // Nombre de la columna a la que se hace referencia
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true, // Permitir valores nulos para soft deletes
      },
    });
    // Agregar índice único en name y tableId
    await queryInterface.addIndex('relations', ['name', 'tableId'], {
      unique: true,
      name: 'unique_name_tableId',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('relations');
  },
};
