const profile = { name: "Gemini", hobbies: ["AI", "Coding"], age: 1 };

const jsonStr = JSON.stringify(profile);
console.log("JSON 字串:", jsonStr);

const originalObj = JSON.parse(jsonStr);
console.log("還原物件姓名:", originalObj.name);