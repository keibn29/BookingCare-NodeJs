module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true, //có thể có giá trị null khi chưa update
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};