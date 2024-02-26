import { Sequelize } from "sequelize";
import connection from "../database/database.js";


const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});


// Category.sync({force : true});

export default Category;


