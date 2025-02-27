const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/figurinos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro ao conectar no MongoDB:', err));

const figurinoSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    tamanho: String,
    categoria: String,
    imagemUrl: String,
});

const Figurino = mongoose.model('Figurino', figurinoSchema);

app.get('/', (req, res) => {
    res.render('index', { isHome: true });
});

app.get('/figurinos', async (req, res) => {
    try {
        const figurinos = await Figurino.find();
        res.render('figurinos', { isHome: false, figurinos });
    } catch (err) {
        console.log(err);
        res.send('Erro ao carregar figurinos');
    }
});

app.get('/bolsistas', (req, res) => {
    res.render('bolsistas', { isHome: false });
});

app.get('/perfil', (req, res) => {
    res.render('perfil', { isHome: false });
});

app.post('/figurinos', async (req, res) => {
    const { nome, tipo, tamanho, categoria, imagemUrl } = req.body;
    if (!nome || !tipo || !tamanho || !categoria || !imagemUrl) {
        return res.status(400).send('Todos os campos são obrigatórios');
    }

    const novoFigurino = new Figurino({ nome, tipo, tamanho, categoria, imagemUrl });

    try {
        await novoFigurino.save();
        res.status(201).json(novoFigurino);
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao adicionar figurino');
    }
});

app.put('/figurinos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, tamanho, categoria, imagemUrl } = req.body;

    try {
        const figurino = await Figurino.findByIdAndUpdate(id, { nome, tipo, tamanho, categoria, imagemUrl }, { new: true });
        res.send(figurino);
    } catch (err) {
        console.log(err);
        res.send('Erro ao editar figurino');
    }
});

app.delete('/figurinos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Figurino.findByIdAndDelete(id);
        res.send({ message: 'Figurino excluído com sucesso!' });
    } catch (err) {
        console.log(err);
        res.send('Erro ao excluir figurino');
    }
});

app.listen(9000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
