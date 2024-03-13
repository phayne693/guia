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
        ],
        limit: 4
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

//buscar por categoria
app.get('/category/:slug', (req,res) =>{
    let slug  = req.params.slug;

    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles : category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect('/')
    })

})


// //buscar por barra de pesquisa
// app.get('/searchbar', async (req, res) => {
//     const query = req.query.query; // Obtém o termo de pesquisa da query string
//     console.log(query)
//     try {
//         // Consulta para buscar artigos com base na pesquisa
//         const articles = await Article.findAll({
//             where: {
//                 title: {[Sequelize.Op.like] : "%" + query + "%"}
//             }
//         }).then(res.render('test', { articles }))
//         // console.log('Artigos encontrados:', articles);
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Erro ao buscar artigos.');
//     }
// });



app.listen(8090, () => {
    console.log("Servidor rodando na porta 8090")
})