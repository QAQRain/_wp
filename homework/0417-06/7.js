/**
 * 7. 箭頭函數處理物件
 */
const users = [
  { name: "Alice", age: 25 }, 
  { name: "Bob", age: 17 }
];

// 使用 filter 篩選出年滿 18 歲的使用者
const adults = users.filter(user => user.age >= 18);

console.log(adults); 
// 輸出：[{ name: "Alice", age: 25 }]