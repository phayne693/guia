import { Sequelize } from "sequelize";

const connection = new Sequelize('guia', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});


export default connection;