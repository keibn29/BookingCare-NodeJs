'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT
            },
            descriptionHTML: {
                type: Sequelize.TEXT
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            nameVi: {
                type: Sequelize.STRING
            },
            nameEn: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Clinics');
    }
};