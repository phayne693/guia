import { Sequelize } from "sequelize";
import connection from "../database/database.js";
import { name } from "ejs";


const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
        type: Sequelize.BOOLEAN, 
        allowNull: false
    }
});


//User.sync({force : true});

export default User;


