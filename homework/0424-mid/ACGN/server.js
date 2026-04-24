const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'bahamut-clone-secret-key-2024';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        }
    } catch (e) {}
    return { users: [], posts: [], comments: [], boards: [
        { id: 1, name: '動漫討論', description: '動畫、漫畫相關討論' },
        { id: 2, name: '遊戲討論', description: '遊戲相關議題' },
        { id: 3, name: '生活綜合', description: '生活大小事' }
    ]};
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '請先登入' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        res.status(401).json({ error: 'token 無效' });
    }
};

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    const data = loadData();
    if (data.users.find(u => u.username === username)) {
        return res.status(400).json({ error: '帳號已存在' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), username, password: hashedPassword, email, createdAt: new Date().toISOString() };
    data.users.push(user);
    saveData(data);
    res.json({ message: '註冊成功', user: { id: user.id, username } });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const data = loadData();
    const user = data.users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: '帳號或密碼錯誤' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
});

app.get('/api/user', auth, (req, res) => {
    const data = loadData();
    const user = data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: '用戶不存在' });
    res.json({ id: user.id, username: user.username, email: user.email });
});

app.get('/api/boards', (req, res) => {
    const data = loadData();
    res.json(data.boards);
});

app.get('/api/boards/:id/posts', (req, res) => {
    const data = loadData();
    const posts = data.posts.filter(p => p.boardId === parseInt(req.params.id));
    res.json(posts.map(p => ({ ...p, author: data.users.find(u => u.id === p.authorId)?.username })));
});

app.get('/api/posts/:id', (req, res) => {
    const data = loadData();
    const post = data.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '文章不存在' });
    const author = data.users.find(u => u.id === post.authorId);
    const comments = data.comments.filter(c => c.postId === post.id).map(c => ({
        ...c,
        author: data.users.find(u => u.id === c.authorId)?.username
    }));
    res.json({ ...post, author: author?.username, comments });
});

app.post('/api/posts', auth, (req, res) => {
    const { title, content, boardId } = req.body;
    const data = loadData();
    const post = {
        id: Date.now(),
        title,
        content,
        boardId: parseInt(boardId),
        authorId: req.user.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
    };
    data.posts.push(post);
    saveData(data);
    res.json({ message: '發文成功', post });
});

app.post('/api/posts/:id/like', auth, (req, res) => {
    const data = loadData();
    const post = data.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '文章不存在' });
    post.likes = (post.likes || 0) + 1;
    saveData(data);
    res.json({ likes: post.likes });
});

app.post('/api/posts/:id/view', (req, res) => {
    const data = loadData();
    const post = data.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '文章不存在' });
    post.views = (post.views || 0) + 1;
    saveData(data);
    res.json({ views: post.views });
});

app.post('/api/posts/:id/comments', auth, (req, res) => {
    const { content } = req.body;
    const data = loadData();
    const post = data.posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: '文章不存在' });
    const comment = {
        id: Date.now(),
        postId: post.id,
        authorId: req.user.id,
        content,
        createdAt: new Date().toISOString()
    };
    data.comments.push(comment);
    saveData(data);
    const author = data.users.find(u => u.id === req.user.id);
    res.json({ message: '留言成功', comment: { ...comment, author: author.username } });
});

app.get('/api/posts', (req, res) => {
    const data = loadData();
    const posts = data.posts.map(p => ({
        ...p,
        author: data.users.find(u => u.id === p.authorId)?.username,
        boardName: data.boards.find(b => b.id === p.boardId)?.name
    })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(posts);
});

app.listen(PORT, () => {
    console.log(`伺服器運作中: http://localhost:${PORT}`);
});