const express = require('express');
const { initDB, getDB, saveDB } = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  res.render('index', { posts });
});

app.get('/post/:id', (req, res) => {
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    res.render('post', { post });
  } else {
    res.redirect('/');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.redirect('/new');
  const db = getDB();
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  saveDB();
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const db = getDB();
  db.run('DELETE FROM posts WHERE id = ?', [parseInt(req.params.id)]);
  saveDB();
  res.redirect('/');
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});