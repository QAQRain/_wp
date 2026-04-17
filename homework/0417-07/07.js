// 1. 實作模擬資料庫查詢的函數
function fakeGet(sql, params, callback) {
    // 這裡我們不真的去查資料庫，而是直接回傳假資料給 callback
    const fakeRow = { 
        id: 1, 
        title: "掌握 JavaScript 函數", 
        content: "這是一篇關於 Callback 的文章..." 
    };
    
    // 執行回呼函數，傳入 (錯誤為 null, 資料物件為 fakeRow)
    callback(null, fakeRow);
}

// 2. 測試呼叫
const query = "SELECT * FROM posts WHERE id = ?";
const inputParams = [1];

fakeGet(query, inputParams, (err, row) => {
    if (err) {
        console.error("查詢失敗");
    } else {
        // 練習解答：使用點符號存取物件屬性
        console.log("抓到的文章標題是：", row.title); 
        
        // 補充：也可以用上一題學到的「中括號存取」
        // console.log("抓到的文章標題是：", row["title"]);
    }
});