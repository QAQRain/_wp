/**
 * 10. 綜合應用：計算總價
 * @param {Array} cart - 商品價格陣列
 * @param {function} discountFunc - 處理折扣的運算函數
 * @returns {number} - 折扣後的最終總價
 */
function calculateTotal(cart, discountFunc) {
  // 1. 先將 cart 內所有數字相加得到總和
  // 這裡使用 reduce 或是簡單的 for 迴圈皆可
  let sum = cart.reduce((acc, curr) => acc + curr, 0);

  // 2. 將總和傳入 discountFunc 處理並回傳結果
  return discountFunc(sum);
}

// 測試：傳入 [100, 200, 300] 並透過匿名函數扣除 50 元
const cart = [100, 200, 300];
const finalPrice = calculateTotal(cart, (total) => total - 50);

console.log("最終總價為:", finalPrice); 
// 運算過程：(100 + 200 + 300) = 600 -> 600 - 50 = 550
// 輸出：最終總價為: 550