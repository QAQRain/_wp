// 1. 定義 checkAdmin 函數
function checkAdmin(role, callback) {
    if (role !== "admin") {
        // 發生錯誤：第一個參數傳入錯誤訊息
        callback("Access Denied");
    } else {
        // 成功：第一個參數傳入 null，第二個參數傳入成功資料
        callback(null, "Welcome");
    }
}

// 2. 測試狀況 A：非管理員登入
checkAdmin("guest", (err, message) => {
    if (err) {
        console.log("錯誤處理：", err); // 輸出: Access Denied
        return; // 提早結束，不執行後續動作
    }
    console.log(message);
});

// 3. 測試狀況 B：管理員登入
checkAdmin("admin", (err, message) => {
    if (err) {
        console.log("錯誤處理：", err);
        return;
    }
    console.log("成功訊息：", message); // 輸出: Welcome
});