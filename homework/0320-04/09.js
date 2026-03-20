const rawData = '[{"name": "Alice", "tel": "0911"}, {"name": "Bob", "tel": "0922"}]';

function searchPhone(searchName) {
  const data = JSON.parse(rawData);
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === searchName) return data[i].tel;
  }
  return "找不到此人";
}

console.log("Alice 的電話:", searchPhone("Alice"));
console.log("Eve 的電話:", searchPhone("Eve"));