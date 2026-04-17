/**
 * 5. 函數回傳函數 (Higher-Order Function)
 * @param {number} factor - 乘數
 * @returns {function} - 一個接受 n 並回傳 n * factor 的函數
 */
function multiplier(factor) {
  // 回傳一個箭頭函數
  return (n) => n * factor;
}

// 範例用法
const double = multiplier(2);
console.log(double(10)); // 輸出: 20

const triple = multiplier(3);
console.log(triple(10)); // 輸出: 30