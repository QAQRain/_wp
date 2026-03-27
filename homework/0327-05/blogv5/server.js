const express = require('express');
const session = require('express-session');
const multer = require('multer');
const { initDB, getDB, saveDB } = require('./database');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));
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
    SELECT posts.*, users.username as author_name,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
    FROM posts 
    LEFT JOIN users ON posts.author_id = users.id 
    ORDER BY posts.created_at DESC
  `);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  const user = getUser(req);
  const likedPosts = getLikedPosts(user ? user.id : null);
  const recommended = getRecommendedPosts(5);
  res.render('index', { posts, user, likedPosts, recommended });
});

app.get('/post/:id', (req, res) => {
  const db = getDB();
  const stmt = db.prepare(`
    SELECT posts.*, users.username as author_name,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
    FROM posts 
    LEFT JOIN users ON posts.author_id = users.id 
    WHERE posts.id = ?
  `);
  stmt.bind([parseInt(req.params.id)]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    const user = getUser(req);
    const isOwner = user && post.author_id === user.id;
    const hasLiked = user ? getLikedPosts(user.id).includes(post.id) : false;
    res.render('post', { post, user, isOwner, hasLiked });
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

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.json({ success: false });
  res.json({ success: true, url: '/uploads/' + req.file.filename });
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
  const stmt = db.prepare('SELECT id, username, password FROM users');
  const users = [];
  while (stmt.step()) {
    users.push(stmt.getAsObject());
  }
  res.render('users', { users, user: null });
});

app.get('/user/:id', (req, res) => {
  const db = getDB();
  const userId = parseInt(req.params.id);
  
  const userStmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
  userStmt.bind([userId]);
  if (!userStmt.step()) {
    return res.redirect('/');
  }
  const targetUser = userStmt.getAsObject();
  
  const postStmt = db.prepare(`
    SELECT posts.*, users.username as author_name,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    WHERE posts.author_id = ?
    ORDER BY posts.created_at DESC
  `);
  postStmt.bind([userId]);
  const posts = [];
  while (postStmt.step()) {
    posts.push(postStmt.getAsObject());
  }
  
  const currentUser = getUser(req);
  res.render('user', { targetUser, posts, user: currentUser });
});

app.post('/like/:id', (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect('/login');
  const db = getDB();
  const postId = parseInt(req.params.id);
  
  const checkStmt = db.prepare('SELECT id FROM likes WHERE post_id = ? AND user_id = ?');
  checkStmt.bind([postId, user.id]);
  
  if (checkStmt.step()) {
    db.run('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, user.id]);
  } else {
    db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, user.id]);
  }
  saveDB();
  res.redirect('/post/' + postId);
});

function getLikedPosts(userId) {
  if (!userId) return [];
  const db = getDB();
  const stmt = db.prepare('SELECT post_id FROM likes WHERE user_id = ?');
  stmt.bind([userId]);
  const liked = [];
  while (stmt.step()) {
    liked.push(stmt.getAsObject().post_id);
  }
  return liked;
}

function getRecommendedPosts(limit = 5) {
  const db = getDB();
  const stmt = db.prepare(`
    SELECT posts.id, posts.title, users.username as author_name
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY COUNT(likes.id) DESC, posts.created_at DESC
    LIMIT ?
  `);
  stmt.bind([limit]);
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  return posts;
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});