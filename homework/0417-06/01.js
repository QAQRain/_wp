/**
 * 1. Callback 基礎實作
 * @param {number} num1 - 第一個數字
 * @param {number} num2 - 第二個數字
 * @param {function} action - 用於處理運算邏輯的回呼函數
 */
function mathTool(num1, num2, action) {
  return action(num1, num2);
}

// 實作「相加」並印出結果
const additionResult = mathTool(10, 5, (a, b) => a + b);
console.log(additionResult); // 輸出：15

// 實作「相減」並印出結果
const subtractionResult = mathTool(10, 5, (a, b) => a - b);
console.log(subtractionResult); // 輸出：5