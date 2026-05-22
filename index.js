const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("servidor ativo e operante!");
})

app.get('/usuarios', (req, res) => {
    const sql = "select * from usuarios";
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.menssage });
        }
        res.json({data: rows});
    });
});

app.post('/usuarios', (req, res) => {
    const {nome, email} = req.body;
    const sql = `insert into usuarios (nome, email) values (?,?)`;

    db.run(sql, [nome, email], function(err) {
        if (err) {
            return res.status(400).json({ erro: err.menssage});
        
        }
        res.json ({id:this.lasID, mensagem: "usuario cadastrado!"});
    });

});

app.listen(PORT, () => {
    console.log('servidor rodando em http://localhost:${PORT}');
});

const db = new sqlite3.database('./meubanco.db', (err) => {
    if (err) {
        console.erro("erro ao conectar ao banco:", err.menssage);
    } else {
        console.log("conectado ao banco de dados SQLite!");
    }
});

app.put('/usuarios/:id', (req, res)=> {
    const id = req.params.id;
    const {nome, email} = req.body;
    const sql = `UPDATE usuarios SET nome =?, email =? WHERE id =?`;

    db.run(sql,[nome, email, id], function(err) {
        if (err) return res.status(500).json({erro: err.message});
        res.json({mensagem: "Atualizado com sucesso!", alteracoes:this.changes});
    });
});

const sql = `CREATE TABLE IF NOT EXISTS usuarios ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXTO NOT NULL,
    email TEXT UNIQUE NOT NULL
)`;

db.run(sql, (err) => {
    if (err) console.error("erro ao criar tabela:", err.menssage);
    else console.log("tabela 'usuarios' prontapara uso!");

});

async function cadastrarUsuario(dados){
    const response = await fetch('http://localhost:300/usuarios',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(dados)
    });

    if (response.ok){
        const result = await response.json();
        alert(`Sucesso! Usua´rio ID $result.id} cadastrado.`)
    }else {
        alert("Erro no cadastro.");
    }
}

async function carregarUsuarios(){
    const response = await fetch('http://localhost:300/usuarios');
    const {data} = await response.json();
    const lista = document.getElementById('lista');
    lista.innerHTML ='';

    data.forEach(user => {
        const item = document.createElement('li');
        item.textContent = `${user.nome} - ${user.email}`;
        lista.appendChild(item);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = async () => {
            await fetch(`http://localhost:300/usuarios/${user.id}`, {method: 'DELETE'});
            carregarUsuarios();

        };
        item.appendChild(btnExcluir);    
    });
}
window.onload=carregarUsuarios;

app.delete('/usuarios/id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM usuarios WHERE id =?`;

    db.run(sql, id, function(err){
        if (err) return req.status(500).json({erro: err.menssage});
        res.json({mensagem: "Removido!", linhasAfetadas: this.changes });
    });
});

let idEdicao = null;

function prepararEdicao(user) {
    document.getElementById('nome').value = user.nome;
    document.getElementById('email').value = user.email;
    idEdicao = user.id;
}

if (idEdicao){

} else {

}

try{
    const res = await fetch('...');
    if (!res,ok) throw new Error("Falha na comunicação");
} catch (erro){
    console.error("Erro capturado: ", erro.mensage);
    alert("Não foi possível conectar ao servidor.");
}