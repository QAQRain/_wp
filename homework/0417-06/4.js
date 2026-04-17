/**
 * 4. 陣列參數的「破壞性修改」
 * @param {Array} arr - 會被直接修改的原陣列
 */
function cleanData(arr) {
  // 移除最後一個元素
  arr.pop();
  // 在最前面加上 "Start"
  arr.unshift("Start");
}

let myData = [1, 2, 3];

// 執行函數
cleanData(myData);

// 觀察原始變數 myData
console.log(myData); 
// 輸出：["Start", 1, 2]