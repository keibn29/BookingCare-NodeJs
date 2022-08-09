const { Sequelize } = require('sequelize');


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('d6qskv1vbum76f', 'puxfviymbwunik', 'e2b8476a968905b70345d8e3e94c2f4be89fd9a4c889e7bdc41063af417bfeb0', {
    host: 'ec2-44-205-112-253.compute-1.amazonaws.com',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;