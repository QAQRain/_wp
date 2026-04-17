// 1. 定義 fetchData 函數
function fetchData(id, callback) {
    // 模擬從資料庫抓取資料的過程
    const fakeData = {
        id: id,
        status: "success"
    };

    // 依照 Node.js 慣例呼叫 callback
    // 第一個參數是錯誤（這裡假設一切正常，傳入 null）
    // 第二個參數是實際的資料
    callback(null, fakeData);
}

// 2. 執行 fetchData 並處理回傳的結果
fetchData(101, (err, data) => {
    if (err) {
        console.log("發生錯誤：" + err);
    } else {
        console.log("成功取得資料：", data); 
        // 預期輸出：成功取得資料： { id: 101, status: 'success' }
    }
});