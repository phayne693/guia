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
                password : hash
            }).then(() =>{
                res.redirect('/')
            }).catch((err) =>{
                res.send('AQUI')
            });
        }else{
            res.status(400).json({error: 'Email já cadastrado!'})
        }
    });
});




export default router;