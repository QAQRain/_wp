/**
 * 9. 延遲執行的 Callback
 */
const taskParts = ["Task", "Completed"];

// 使用 setTimeout 設定延遲 2000 毫秒（2秒）
setTimeout(() => {
  // 使用 join 方法將陣列組合成字串，中間補上空白
  const message = taskParts.join(" ");
  console.log(message);
}, 2000);