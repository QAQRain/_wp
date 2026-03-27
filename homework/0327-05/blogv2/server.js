const express = require('express');
const session = require('express-session');
const { initDB, getDB, saveDB } = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog-secret-key',
  resave: false,
  saveUninitialized: true
}));

function getUser(req) {
  if (!req.session.userId) return null;
  const db = getDB();
  const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
  stmt.bind([req.session.userId]);
  if (stmt.step()) {
    return stmt.getAsObject();
  }
  return null;
}

app.get('/', (req, res) => {
  const db = getDB();
  const stmt = db.prepare(`
    SELECT posts.*, users.username as author_name 
    FROM posts 
    LEFT JOIN users ON posts.author_id = users.id 
    ORDER BY posts.created_at DESC
  `);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  const user = getUser(req);
  res.render('index', { posts, user });
});

app.get('/post/:id', (req, res) => {
  const db = getDB();
  const stmt = db.prepare(`
    SELECT posts.*, users.username as author_name 
    FROM posts 
    LEFT JOIN users ON posts.author_id = users.id 
    WHERE posts.id = ?
  `);
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    const user = getUser(req);
    const isOwner = user && post.author_id === user.id;
    res.render('post', { post, user, isOwner });
  } else {
    res.redirect('/');
  }
});

app.get('/new', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  res.render('new', { user });
});

app.post('/posts', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  const { title, content } = req.body;
  if (!title || !content) return res.redirect('/new');
  const db = getDB();
  db.run('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)', [title, content, user.id]);
  saveDB();
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  const db = getDB();
  const stmt = db.prepare('SELECT author_id FROM posts WHERE id = ?');
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    if (post.author_id === user.id) {
      db.run('DELETE FROM posts WHERE id = ?', [parseInt(req.params.id)]);
      saveDB();
    }
  }
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  const db = getDB();
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    if (post.author_id !== user.id) return res.redirect('/');
    res.render('edit', { post, user });
  } else {
    res.redirect('/');
  }
});

app.post('/edit/:id', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  const { title, content } = req.body;
  const db = getDB();
  const stmt = db.prepare('SELECT author_id FROM posts WHERE id = ?');
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    if (post.author_id === user.id) {
      db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, parseInt(req.params.id)]);
      saveDB();
    }
  }
  res.redirect('/post/' + req.params.id);
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { user: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDB();
  const stmt = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?');
  stmt.bind([username, password]);
  if (stmt.step()) {
    const user = stmt.getAsObject();
    req.session.userId = user.id;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('register', { user: null });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect('/register');
  const db = getDB();
  try {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    saveDB();
    const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
    stmt.bind([username]);
    if (stmt.step()) {
      const user = stmt.getAsObject();
      req.session.userId = user.id;
    }
    res.redirect('/');
  } catch (e) {
    res.redirect('/register');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/users', (req, res) => {
  const db = getDB();
  const stmt = db.prepare('SELECT username, password FROM users');
  const users = [];
  while (stmt.step()) {
    users.push(stmt.getAsObject());
  }
  res.render('users', { users, user: null });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});