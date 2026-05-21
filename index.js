app.post('/usuarios', (req, res) =>{
    const {nome, email} = req.body;
    const sql = "INSERT INTO usuarios (nome, email) VALUES (?,?)";

    db.all

}