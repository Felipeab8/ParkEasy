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

app.post('/cadastrar-veiculo', (req, res) => {
    const { TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO } = req.body;

    const sql = 'INSERT INTO VEICULO_CLIENTE (TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO) VALUES (?, ?, ?)';

    db.query(sql, [TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao inserir veículo' });
        }
        console.log('Veículo cadastrado com sucesso.');
        return res.json({ success: true, message: 'Veículo cadastrado com sucesso' });
    });
});

app.get('/veiculos', (req, res) => {
    db.query('SELECT * FROM VEICULO_CLIENTE', (err, results) => {
        if (err) {
            console.error('Erro ao buscar veículos: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar veículos' });
        }
        res.json({ success: true, veiculos: results });
    });
});

app.get('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;
    db.query('SELECT * FROM VEICULO_CLIENTE WHERE ID_VEICULO_CADASTRADO = ?', veiculoId, (err, results) => {
        if (err) {
            console.error('Erro ao buscar veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar veículo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }
        const veiculo = results[0];
        res.json({ success: true, veiculo: veiculo });
    });
});

app.put('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;
    const { TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO } = req.body;

const sql = 'UPDATE VEICULO_CLIENTE SET TIPO_VEICULO = ?, MODELO_VEICULO = ?, PLACA_VEICULO = ? WHERE ID_VEICULO_CADASTRADO = ?';

db.query(sql, [TIPO_VEICULO, MODELO_VEICULO, PLACA_VEICULO, veiculoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar veículo' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
        }

        res.json({ success: true, message: 'Veículo atualizado com sucesso.' });
    });
});

app.delete('/veiculos/:id', (req, res) => {
    const veiculoId = req.params.id;

    db.query('DELETE FROM VEICULO_CLIENTE WHERE ID_VEICULO_CADASTRADO = ?', veiculoId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir veículo: ' + err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir veículo' });
        }
        res.json({ success: true, message: 'Veículo excluído com sucesso' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ouvindo na porta ${PORT}`);
});