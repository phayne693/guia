import bodyParser from 'body-parser';
import express from 'express';
import connection from './database/database.js';
//importando controladores
import categoriesController from './categories/categoriesController.js';
import articlesController from './articles/articlesController.js';
//importando models
import Category from './categories/categories.js';
import Article from './articles/articles.js';
import { Sequelize } from 'sequelize';

//database
connection.authenticate().then(() => {
    console.log('Conectado com o banco de dados!')
}).catch((error) =>{
    console.error(error)
})


const app = express();
//view engine
app.set('view engine', 'ejs');
//trabalhar com formularios
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
//arquivos estaticos
app.use(express.static('public'));


//usando rota controller
app.use('/', categoriesController)

app.use('/', articlesController)



//trax os artigos par page home
app.get('/', (req, res) => {
    Article.findAll({
        where: {
            title: {
                [Sequelize.Op.not]: null // Verifica se o título não é nulo
            },
            body: {
                [Sequelize.Op.not]: null // Verifica se o corpo não é nulo
            },
            categoryId: {
                [Sequelize.Op.not]: null // Verifica se a categoria não é nula
            }
        },
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles:articles, categories:categories});
        });
    });
});

//pagina de leitura
app.get('/:slug', (req,res) => {
    let slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then( article => {
        if(article != undefined){
            res.render('article', {article: article})
        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
});

app.listen(8090, () => {
    console.log("Servidor rodando na porta 8090")
})