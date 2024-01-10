import bodyParser from 'body-parser';
import express from 'express';
import connection from './database/database.js'

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

app.get('/', (req, res) => {
    res.render('index');
})


app.listen(8090, () => {
    console.log("Servidor rodando na porta 8090")
})