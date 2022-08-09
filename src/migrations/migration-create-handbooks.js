'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Handbooks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            titleVi: {
                type: Sequelize.STRING
            },
            titleEn: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT
            },
            descriptionHTML: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('Handbooks');
    }
};