import express from 'express';
import { Sequelize } from 'sequelize';
import User from './user.js';
import bcryptjs from 'bcryptjs'

const router = express.Router();

router.get('/admin/users', (req, res) => {
    res.send('lista de usuarios')
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

//criar usuarios
router.post('/users/createnew', (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let name = req.body.name
    let admin = req.body.admin

    //validar email repetido
    User.findOne({
        where:{
            email:email
        }
    }).then( user =>{
        if(user == undefined){
            //salt e utilizado para aumentar a seguranca do bcrypt
            let salt = bcryptjs.genSaltSync(10)
            let hash = bcryptjs.hashSync(password, salt) 

            User.create({
                email : email,
                password : hash,
                name: name,
                admin : admin
            }).then(() =>{
                res.json({email, password, name, admin})
            }).catch((err) =>{
                res.send(err)
            });
        }else{
            res.status(400).json({error: 'Email já cadastrado!'})
        }
    });
});


//listar usuarios
router.get('/users', (req, res) => {

    User.findAll().then(user => {
        res.render('admin/users/index', {user: user})
    });
});

//deletar usuarios
router.post('/users/delete' ,(req,res) => {
    let id= req.body.id;

    if(!isNaN(id)){
        User.destroy({
            where:{
                id:id
            }
        }).then(() =>{
            res.redirect('/users')
        }).catch((err) =>{
            res.send(err)
        });
    }else{
        res.send('Error')
    }
});

//login
router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

//autenticacao
router.post('/authenticate' ,(req, res) => {
    let email = req.body.email
    let password = req.body.password

    //realizar busca do usuario
    User.findOne({
        where: {'email': email}
    }).then(user => {
        if(user){//se existir usuario com email
            //validar senha
            let pass_correct = bcryptjs.compareSync(password, user.password);
            //se as senhas forem iguais
            if(pass_correct){
                //cria a sessão do usuario
                req.session.userId = {
                    id: user.id,
                    email: user.email
                };
            }else{
                res.status(401).json({error: 'Senha incorreta'})
            }
        }else{
            res.status(404).json({error: 'Email não encontrado'})
        }
    }).catch(err => {
        res.status(500).json({error: err})
    })
})


export default router;