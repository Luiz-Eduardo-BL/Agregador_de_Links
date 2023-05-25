import express, { json } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3001;

app.use(cors(
  // {
  //   origin: 'agregador-gamma.vercel.app/',
  // }
));
app.use(json());

const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Rota para buscar links com base na pesquisa
app.get('/api/links', (req, res) => {
  const searchTerm = req.query.search;

  let sql = 'SELECT * FROM links';
  let params = [];

  if (searchTerm) {
    sql += ' WHERE title LIKE ? OR type LIKE ?';
    params = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erro ao buscar os links.');
    }

    return res.status(200).json(rows);
  });
});


app.post('/api/links', (req, res) => {
  const { title, url, type } = req.body;

  if (!title || !url || !type) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.run('INSERT INTO links (title, url, type) VALUES (?, ?, ?)', [title, url, type], function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
      res.json({ message: 'Link criado com sucesso', id: this.lastID });
    }
  });
});

app.delete('/api/links/:id', (req, res) => {
  const linkId = req.params.id;

  const sql = 'DELETE FROM links WHERE id = ?';
  db.run(sql, [linkId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erro ao deletar o link.');
    }

    console.log(`Link with id ${linkId} deleted.`);
    return res.status(200).send('Link deletado com sucesso.');
  });
});

app.listen(port, () => {
  console.log(`Servidor backend em execução em http://localhost:${port}`);
});