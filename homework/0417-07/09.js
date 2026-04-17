const contents = [
  "Very long content here", 
  "Another Very long content here", 
  "3rd Very long content here"
];

// 使用 map 遍歷並截取前 10 個字元
const summaries = contents.map(text => {
  // 取出索引 0 到 10 (不含 10) 的字元，並加上 ...
  return text.substring(0, 10) + "...";
});

console.log(summaries);
// 預期輸出: ["Very long ...", "Another Ve...", "3rd Very l..."]