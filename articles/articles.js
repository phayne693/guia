import { Sequelize } from "sequelize";
import connection from "../database/database.js";
import Category from '../categories/categories.js'

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});


//relcionamento com a tabela categoria
Category.hasMany(Article);//uma categoria possui mtos artigos
Article.belongsTo(Category);//um artigo pertence a uma categoria

//rodar apenas uma vez para criar tabela
// Article.sync({force:true})

export default Article;


