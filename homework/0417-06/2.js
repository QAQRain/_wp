/**
 * 2. 匿名函數與立即執行 (IIFE)
 */
(function() {
  const count = 100;
  console.log("Count is: " + count);
})();

// 測試：嘗試在外部存取 count
try {
  console.log(count);
} catch (error) {
  console.log("外部無法存取 count，驗證成功！");
}