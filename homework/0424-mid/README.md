# 專案名稱 -- ACGN 討論區（類似巴哈姆特）

> 本專案使用 Opencode MiniMax M2.5 輔助生成

---

## 1. 專案介紹

### 1.1 動機
巴哈姆特是我最常使用的網站之ㄧ，最常瀏覽遊戲相關的攻略，同時也會在相關版面發布一些貼文，所以也想嘗試製作一個類似於此網站的社群軟體，並以AI協助製作，同時也能學習製作相關網站時所需的資源。

### 1.2 目標
主要只希望還原部分功能即可，如不同版面、帳號功能、發布文章功能

### 1.3 功能
目前已呈現的功能如下:
- 帳號登入及註冊功能
- 討論版分類(動漫、遊戲、生活綜合)
- 發布、瀏覽文章
- 按讚、瀏覽次數
- 留言

---

## 2. 技術栈

### 2.1 前端
| 技術 | 用途 |
|------|------|
| HTML5 | 網頁結構 |
| CSS3 | 樣式設計 |
| JavaScript (原生) | 互動邏輯 |

### 2.2 後端
| 技術 | 用途 |
|------|------|
| Node.js | 執行環境 |
| Express | Web 框架 |
| bcryptjs | 密碼雜湊 |
| jsonwebtoken (JWT) | 用戶認證 |

### 2.3 資料儲存
- JSON 檔案（開發階段）
- 可擴充為 SQLite/MySQL

---

## 3. 系統架構
```
┌─────────────┐     HTTP      ┌─────────────┐
│   瀏覽器     │ ◄──────────► │  Node.js    │
│ (前端頁面)   │   JSON/API   │  (後端伺服器) │
└─────────────┘              └──────┬──────┘
                                    │
                             ┌──────▼──────┐
                             │  data.json  │
                             │ (資料庫)    │
                             └─────────────┘
```

## 4. 檔案結構
```
/ACGN/
├── package.json          # NPM 專案設定
├── server.js             # 後端伺服器主程式
├── data.json             # 資料庫（自動建立）
└── public/
    └── index.html        # 前端頁面
```

---

## 5. API設計

### 5.1 帳號功能

| 方法 | 路徑 | 功能 |
|------|------|------|
| POST | /api/register | 註冊新用戶 |
| POST | /api/login | 用戶登入 |
| GET | /api/user | 取得用戶資料（需驗證） |

### 5.2 討論板

| 方法 | 路徑 | 功能 |
|------|------|------|
| GET | /api/boards | 取得所有看板 |
| GET | /api/boards/:id/posts | 取得看板內的文章 |

### 5.3 文章

| 方法 | 路徑 | 功能 |
|------|------|------|
| GET | /api/posts | 取得所有文章（首頁） |
| GET | /api/posts/:id | 取得單篇文章（含留言） |
| POST | /api/posts | 發表新文章（需登入） |
| POST | /api/posts/:id/like | 按讚（需登入） |
| POST | /api/posts/:id/view | 增加瀏覽數 |

### 5.4 留言

| 方法 | 路徑 | 功能 |
|------|------|------|
| POST | /api/posts/:id/comments | 發表留言（需登入） |

---

## 6. 程式碼說明

### 6.1 server.js 解析

#### 引入模組（第 1-9 行）
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');      // 密碼加密
const jwt = require('jsonwebtoken');     // JWT 認證
const fs = require('fs');
const path = require('path');
```

**說明**：載入所需套件，bcryptjs 用於密碼雜湊（不儲存明文密碼），jwt 用於產生驗證 token。

#### 資料讀寫（第 11-22 行）
```javascript
function loadData() { ... }
function saveData(data) { ... }
```

**說明**：`loadData()` 從 data.json 讀取資料，`saveData()` 將資料寫回。使用 JSON 檔案模擬資料庫。

#### JWT 驗證中介軟體（第 24-33 行）
```javascript
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
```

**說明**：檢查請求是否攜帶有效 JWT token，驗證通過後將用戶資訊存入 `req.user`。

#### 註冊 API（第 35-42 行）
```javascript
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
```

**說明**：
- 檢查帳號是否已存在
- 使用 bcrypt 將密碼雜湊後儲存（安全考量）
- 產生唯一 ID 與時間戳

#### 登入 API（第 44-55 行）
```javascript
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
```

**說明**：
- 驗證帳號密碼
- 產生 7 天有效的 JWT token 回傳給前端
- 前端後續請求攜帶此 token 進行驗證

#### 文章 API（第 89-101 行）
```javascript
app.post('/api/posts', auth, (req, res) => {
    const { title, content, boardId } = req.body;
    const data = loadData();
    const post = {
        id: Date.now(),
        title,
        content,
        boardId: parseInt(boardId),
        authorId: req.user.id,  // 從 JWT 取得用戶 ID
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
    };
    data.posts.push(post);
    saveData(data);
    res.json({ message: '發文成功', post });
});
```

**說明**：使用 `auth` 中介軟體確保只有登入用戶可發文，`req.user.id` 來自 JWT 驗證。

### 6.2 index.html 解析

#### 樣式設計
- 使用 CSS Grid 排列看板卡片
- 深色主題配色（#1a1a2e, #16213e）
- 紅色強調色（#e94560）自己獨特風格

#### 前端邏輯
```javascript
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);  // 存入 localStorage
        currentUser = data.user;
        updateUserUI();
    }
}
```

**說明**：登入成功後將 JWT token 存入瀏覽器 localStorage，後續 API 請求透過 Authorization header 攜帶。

---

## 7. 截圖

[![ying-mu-xie-qu-hua-mian-2026-04-24-110540.png](https://i.postimg.cc/mr6RswpQ/ying-mu-xie-qu-hua-mian-2026-04-24-110540.png)](https://postimg.cc/67RFVdX3)

---

## 8. 心得收獲

### 8.1 技術學習
- 基本使用AI進行Vibe Coding呈現自己需求
- 網站相關基本知識(前端、後端、資料庫)
- 部分程式碼使用邏輯

### 8.2 改進方向
- 更好的發布文章版面編輯功能
- 更多討論版
- 新增版主功能(創建自己版面及管理權)
- 加入文章編輯/刪除功能
- 實作文章分類與標籤
- 加入私人訊息功能
- 新增手機觀看版面
- 瀏覽更多相關類型的網站(巴哈姆特)進行靈感獲取

---

## 10. 參考資源

- [Express 官方文檔](https://expressjs.com/)
- [JWT 介紹](https://jwt.io/)
- [bcryptjs 文件](https://www.npmjs.com/package/bcryptjs)
- [網站原型](https://www.gamer.com.tw/)

**指導老師**：陳鍾誠 老師
**學生**： 陳冠倫