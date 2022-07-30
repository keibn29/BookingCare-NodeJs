'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Specialty.hasMany(models.Doctor, { foreignKey: 'specialtyId', as: 'specialtyData' })
        }
    };
    Specialty.init({
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        image: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};