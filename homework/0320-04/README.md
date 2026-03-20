### 習題4
AI問答 Gemini -- https://gemini.google.com/share/5deeea27737b

## 我的測試結果(1~10題)
```sh
PS D:\Codefile\webdesign\_wp\homework\0320-04> node 01.js
[ 10, 20, 30 ]

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 02.js
5, 4, 3, 2, 1, 0 ... Liftoff!

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 03.js
BMI: 22.5 (正常範圍)

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 04.js
Alex Chen

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 05.js
總金額: 150

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 06.js
JSON 字串: {"name":"Gemini","hobbies":["AI","Coding"],"age":1}
還原物件姓名: Gemini

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 07.js
優秀學生: [ '小明', '小紅' ]

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 08.js
6789

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 09.js
Alice 的電話: 0911
Eve 的電話: 找不到此人

PS D:\Codefile\webdesign\_wp\homework\0320-04> node 10.js
下單成功
庫存不足
```

## 摘要
以下將每一題的**完整程式碼**以及**預期的consle(控制台)測試結果**整理如下
---
### 1. 偶數探測器 (if, for)
**程式碼：**
```javascript
function findEvens(numbers) {
  let evens = [];
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      evens.push(numbers[i]);
    }
  }
  return evens;
}

const result1 = findEvens([10, 15, 20, 25, 30]);
console.log(result1);
```
**測試結果：**
[10, 20, 30]

---

### 2. 倒數計時器 (while)
**程式碼：**
```javascript
function countdown(n) {
  let output = [];
  while (n >= 0) {
    output.push(n);
    n--;
  }
  return output.join(", ") + " ... Liftoff!";
}

console.log(countdown(5));
```
**測試結果：**
5, 4, 3, 2, 1, 0 ... Liftoff!

---

### 3. BMI 計算機 (function, if)
**程式碼：**
```javascript
function calculateBMI(weight, height) {
  let bmi = weight / (height * height);
  let category;
  if (bmi < 18.5) category = "體重過輕";
  else if (bmi < 24) category = "正常範圍";
  else category = "過重";
  
  return `BMI: ${bmi.toFixed(1)} (${category})`;
}

console.log(calculateBMI(65, 1.7));
```
**測試結果：**
BMI: 22.5 (正常範圍)

---

### 4. 個人檔案產生器 (object, function)
**程式碼：**
```javascript
const user = {
  firstName: "Alex",
  lastName: "Chen",
  getFullName: function() {
    return this.firstName + " " + this.lastName;
  }
};

console.log(user.getFullName());
```
**測試結果：**
Alex Chen

---

### 5. 購物清單總計 (array, object, for)
**程式碼：**
```javascript
function getTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }
  return total;
}

const myCart = [{name: "奶茶", price: 60}, {name: "雞排", price: 90}];
console.log("總金額:", getTotal(myCart));
```
**測試結果：**
總金額: 150

---

### 6. JSON 轉換練習 (json, object)
**程式碼：**
```javascript
const profile = { name: "Gemini", hobbies: ["AI", "Coding"], age: 1 };

const jsonStr = JSON.stringify(profile);
console.log("JSON 字串:", jsonStr);

const originalObj = JSON.parse(jsonStr);
console.log("還原物件姓名:", originalObj.name);
```
**測試結果：**
JSON 字串: {"name":"Gemini","hobbies":["AI","Coding"],"age":1}
還原物件姓名: Gemini

---

### 7. 成績管理系統 (array, object, for, if)
**程式碼：**
```javascript
function filterScores(students) {
  let topStudents = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].score >= 80) {
      topStudents.push(students[i].name);
    }
  }
  return topStudents;
}

const classA = [{name: "小明", score: 85}, {name: "小華", score: 70}, {name: "小紅", score: 92}];
console.log("優秀學生:", filterScores(classA));
```
**測試結果：**
優秀學生: ["小明", "小紅"]

---

### 8. 數字反轉 (while, function)
**程式碼：**
```javascript
function reverseNumber(num) {
  let reversed = 0;
  while (num > 0) {
    let digit = num % 10;
    reversed = (reversed * 10) + digit;
    num = Math.floor(num / 10);
  }
  return reversed;
}

console.log(reverseNumber(9876));
```
**測試結果：**
6789

---

### 9. 聯絡人搜尋器 (json, array, for, if)
**程式碼：**
```javascript
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
```
**測試結果：**
Alice 的電話: 0911
Eve 的電話: 找不到此人

---

### 10. 簡單的庫存檢查 (object, function)
**程式碼：**
```javascript
const store = { "筆電": 5, "滑鼠": 0 };

function checkOrder(item, qty) {
  if (store[item] === undefined) return "商品不存在";
  if (store[item] >= qty) return "下單成功";
  return "庫存不足";
}

console.log(checkOrder("筆電", 3));
console.log(checkOrder("滑鼠", 1));
```
**測試結果：**
下單成功
庫存不足