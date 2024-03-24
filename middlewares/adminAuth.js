function adminAuth(req, res, next){
    if(req.session.user){
       const user = req.session.user;
       let auth_admin = user.admin;

       if(auth_admin){
            next();
       } else {
            res.redirect('/')
       }
    } else {
        res.status(401).send({ error: 'Não autenticado. Faça login para acessar esta página.' });   
    }
}

export default adminAuth;