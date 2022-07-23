'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Doctor.init({
        doctorId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Doctor',
        // freezeTableName: true - tắt tự động thêm kí tự 's' mysql khi tạo table
    });
    return Doctor;
};