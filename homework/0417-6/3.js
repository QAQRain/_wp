/**
 * 3. 箭頭函數與陣列轉換
 */
const prices = [100, 200, 300, 400];

// 使用 map 結合單行箭頭函數進行 8 折運算
const discountedPrices = prices.map(price => price * 0.8);

console.log(discountedPrices); 
// 輸出：[80, 160, 240, 320]