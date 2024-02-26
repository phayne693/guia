import bodyParser from 'body-parser';
import express from 'express';
import connection from './database/database.js';
//importando controladores
import categoriesController from './categories/categoriesController.js';
import articlesController from './articles/articlesController.js';
//importando models
import Category from './categories/categories.js';
import Article from './articles/articles.js';

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




app.get('/', (req, res) => {
    res.render('index');
})


app.listen(8090, () => {
    console.log("Servidor rodando na porta 8090")
})