// 建立一個空的 params 物件
const params = {};

// 動態新增屬性
// 方式一：點符號賦值 (最常用)
params.id = 99;

// 方式二：中括號賦值 (當屬性名是變數時必用)
// const keyName = "id";
// params[keyName] = 99;

// 印出物件
console.log(params); 
// 輸出: { id: 99 }

// 模擬讀取
console.log(`目前查看的文章 ID 為: ${params.id}`);