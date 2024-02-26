import express from 'express';
import slugify from 'slugify';
import Category from './categories.js';

const router = express.Router();


router.get('/admin/categories/new', (req, res) => {
    res.render("admin/categories/new")
})

router.post("/categories/save", (req, res) =>{
    let title = req.body.title;
    if(title != undefined){
        //salva no banco
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(res.redirect('/'))
    }else{
        res.redirect('/admin/categories/new')
    }
})
//busca as categorias
router.get("/admin/categories", (req, res) =>{
    
    Category.findAll().then(categories => {res.render("admin/categories/index", {categories : categories})})

    
})

//deletar categorias
router.post("/categories/delete", (req, res) =>{
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id : id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }
    }

});

//ir para view de editar categoria
router.get("/admin/categories/edit/:id", (req, res) => {

    let id = req.params.id
    //findPK pesquisa pelo id de forma mais rapida
    Category.findByPk(id).then(category => {
        
        if(isNaN(id)){
            res.redirect('/admin/categories')
        }

        if(category != undefined){
            res.render('admin/categories/edit', {category: category})
        }else{
            res.redirect("/admin/categories")
        }
    })

})

//editar categoria
router.post("/categories/update", (req, res) => {
    let id = req.body.id
    let title = req.body.title

    Category.update({title: title, slug : slugify(title)}, {
        where: {
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/categories')
    })
})


export default router;