const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 將 JSON 字串轉換為 JavaScript 物件
const obj = JSON.parse(jsonStr);

// 印出 tags 陣列中的第二個元素
// 提示：陣列索引從 0 開始，所以第二個元素的索引是 1
console.log("tags 陣列中的第二個元素:", obj.tags[1]); 

// 預期輸出: node