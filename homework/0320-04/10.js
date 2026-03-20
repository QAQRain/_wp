const store = { "筆電": 5, "滑鼠": 0 };

function checkOrder(item, qty) {
  if (store[item] === undefined) return "商品不存在";
  if (store[item] >= qty) return "下單成功";
  return "庫存不足";
}

console.log(checkOrder("筆電", 3));
console.log(checkOrder("滑鼠", 1));