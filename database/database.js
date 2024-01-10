import { Sequelize } from "sequelize";

const connection = new Sequelize('guia', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


export default connection;