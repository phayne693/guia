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


export default router;