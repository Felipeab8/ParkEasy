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

app.get('/atendimentos', (req, res) => {
    db.query('SELECT * FROM ATENDIMENTO', (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimentos: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar atendimentos' });
        }
        res.json({ success: true, atendimentos: results });
    });
});

app.get('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;
    db.query('SELECT * FROM ATENDIMENTO WHERE ID_ATENDIMENTO = ?', atendimentoId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar atendimento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
        }
        const atendimento = results[0];
        res.json({ success: true, atendimento: atendimento });
    });
});

app.put('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;
    const { DESCRICAO_ATENDIMENTO, VALOR_ATENDIMENTO, ID_CLIENTE } = req.body;

    const sql = 'UPDATE ATENDIMENTO SET DESCRICAO_ATENDIMENTO = ?, VALOR_ATENDIMENTO = ?, ID_CLIENTE = ? WHERE ID_ATENDIMENTO = ?';

    db.query(sql, [DESCRICAO_ATENDIMENTO, VALOR_ATENDIMENTO, ID_CLIENTE, atendimentoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar atendimento' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
        }

        res.json({ success: true, message: 'Atendimento atualizado com sucesso.' });
    });
});

app.delete('/atendimentos/:id', (req, res) => {
    const atendimentoId = req.params.id;

    db.query('DELETE FROM ATENDIMENTO WHERE ID_ATENDIMENTO = ?', atendimentoId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir atendimento: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir atendimento' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Atendimento não encontrado' });
        }

        res.json({ success: true, message: 'Atendimento excluído com sucesso' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});