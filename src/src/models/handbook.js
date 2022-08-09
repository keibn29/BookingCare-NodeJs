'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Handbook.init({
        titleVi: DataTypes.STRING,
        titleEn: DataTypes.STRING,
        image: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Handbook',
    });
    return Handbook;
};