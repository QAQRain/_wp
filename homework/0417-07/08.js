let user = "Guest";

// 使用三元運算子 (condition ? true : false)
const html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

console.log(html); 
// 輸出: <h1>Welcome, Guest</h1>

// --- 測試另一種情況 ---
user = ""; // 假設 user 是空字串 (Falsy)
const html2 = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;
console.log(html2);
// 輸出: <h1>Welcome, Stranger</h1>