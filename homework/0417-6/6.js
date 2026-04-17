/**
 * 6. Callback 篩選器
 * @param {Array} arr - 原始陣列
 * @param {function} callback - 用來判斷元素是否保留的函數
 * @returns {Array} - 篩選後的新陣列
 */
function myFilter(arr, callback) {
  const result = []; // 建立一個新陣列，確保不破壞原陣列

  for (let i = 0; i < arr.length; i++) {
    // 呼叫 callback 並傳入當前元素
    // 如果 callback 回傳為 true，代表符合條件
    if (callback(arr[i])) {
      result.push(arr[i]);
    }
  }

  return result;
}

// 測試：篩選出大於 7 的數字
const numbers = [1, 5, 8, 12];
const filteredNumbers = myFilter(numbers, (item) => item > 7);

console.log(filteredNumbers); 
// 輸出：[8, 12]