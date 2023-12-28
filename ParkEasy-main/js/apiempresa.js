const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/cadastrar-empresa', (req, res) => {
    const { NOME_EMPRESA, CNPJ } = req.body;

    const sql = 'INSERT INTO EMPRESA_ESTACIONAMENTO (NOME_EMPRESA, CNPJ) VALUES (?, ?)';

    db.query(sql, [NOME_EMPRESA, CNPJ], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir empresa' });
        }
        console.log('Empresa cadastrada com sucesso.');
        return res.json({ success: true, message: 'Empresa cadastrada com sucesso' });
    });
});

app.get('/empresas', (req, res) => {
    db.query('SELECT * FROM EMPRESA_ESTACIONAMENTO', (err, results) => {
        if (err) {
            console.error('Erro ao buscar empresas: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar empresas' });
        }
        res.json({ success: true, empresas: results });
    });
});

app.get('/empresas/:id', (req, res) => {
    const empresaId = req.params.id;
    db.query('SELECT * FROM EMPRESA_ESTACIONAMENTO WHERE ID_EMPRESA_ESTACIONAMENTO = ?', empresaId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar empresa: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar empresa' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Empresa não encontrada' });
        }
        const empresa = results[0];
        res.json({ success: true, empresa: empresa });
    });
});

app.put('/empresas/:id', (req, res) => {
    const empresaId = req.params.id;
    const { NOME_EMPRESA, CNPJ } = req.body;

    const sql = 'UPDATE EMPRESA_ESTACIONAMENTO SET NOME_EMPRESA = ?, CNPJ = ? WHERE ID_EMPRESA_ESTACIONAMENTO = ?';

    db.query(sql, [NOME_EMPRESA, CNPJ, empresaId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar empresa: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar empresa' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Empresa não encontrada' });
        }

        res.json({ success: true, message: 'Empresa atualizada com sucesso.' });
    });
});

app.delete('/empresas/:id', (req, res) => {
    const empresaId = req.params.id;

    db.query('DELETE FROM EMPRESA_ESTACIONAMENTO WHERE ID_EMPRESA_ESTACIONAMENTO = ?', empresaId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir empresa: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir empresa' });
        }
        res.json({ success: true, message: 'Empresa excluída com sucesso' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});