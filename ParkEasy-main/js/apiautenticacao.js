const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'PARKEASY',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

app.post('/autenticar-usuario', (req, res) => {
    const { EMAIL_CLIENTE, SENHA } = req.body;

    const sql = 'SELECT * FROM CONTA_CLIENTE WHERE EMAIL_CLIENTE = ? AND SENHA = ?';
    db.query(sql, [EMAIL_CLIENTE, SENHA], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro na autenticação' });
        }

        if (results.length === 1) {
            return res.json({ success: true, message: 'Usuário autenticado com sucesso' });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor de autenticação ouvindo na porta ${PORT}`);
});
