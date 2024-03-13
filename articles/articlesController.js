import express from 'express';
import Category from '../categories/categories.js';
import Article from './articles.js';
import slugify from 'slugify'
import { Sequelize } from 'sequelize';

const router = express.Router();

router.get('/admin/articles', (req, res) => {
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
        include:[{model: Category}]
    }).then(articles => {
        res.render('admin/articles', { articles: articles });
    }).catch(error => {
        console.error('Erro ao recuperar artigos:', error);
        res.status(500).send('Erro interno do servidor');
    });
});

//deletar artigos
router.post("/articles/delete", (req, res) =>{
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id : id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }
    }

});

//buscar categorias e page do artigo
router.get('/admin/articles/new', (req, res) =>{
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories})
    })
    
})

//cadastrar artigo
router.post('/articles/save', (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

//ir para view de editar categoria
router.get("/admin/articles/edit/:id", (req, res) => {

    let id = req.params.id
    //findPK pesquisa pelo id de forma mais rapida
    Article.findByPk(id).then(article => {
        
        if(isNaN(id)){
            res.redirect('/admin/articles')
        }

        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories})
            })
        }else{
            res.redirect("/admin/articles")
        }
    })

})

//editar artigo
router.post("/articles/update", (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category;

    Article.update({title: title, slug : slugify(title), body:body, categoryId: category}, {
        where: {
            id:id
        },
        include:[{model: Category}]
        
    }).then(() =>{
        res.redirect('/admin/articles')
    })
})


//paginacao
router.get('/articles/page/:num', (req, res,) =>{
    let page = req.params.num
    //offset serve para mostrar o conteudo em tela
    let offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        //aqui multiplicamos o valor pela quantiddade de itens que queremos mostrar por tela
        offset = parseInt(page * 4)
    }

    //acha os artigos e faz a contaemg
    Article.findAndCountAll({
        //limite de itens por pagina
        limit: 4,
        offset: offset,
        order:[['id','DESC']]
    }).then( articles => {

        //logica para definir se ainda existe pafinas com conteudos
        let next;
        //fazer a soma do offset mais a qtd de artigos por pag e verificar se e 
        //maior ou igual a qtd de artigos restantes
        //se for next não existe se não existe
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        Category.findAll().then(categories =>{
            //como estamos trazendo a lista de arigos dentro de resultts devemos passar a variavel para view
            res.render('admin/articles/page', {result: result, categories: categories})
        })
        // res.json(result)
    })
})

export default router;