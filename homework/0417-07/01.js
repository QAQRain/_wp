// 宣告 post 物件
const post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};

// 方式一：點符號 (Dot notation)
// 這是最直覺、最常用的方式
console.log("使用點符號:", post.title);

// 方式二：中括號 (Bracket notation)
// 這種方式必須將屬性名稱以「字串」形式放入括號中
console.log("使用中括號:", post["title"]);