let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}
process(listA, listB);

console.log(listA); 
console.log(listB); 
/*
執行結果
執行完該程式碼後，結果如下：
listA: [1, 2, 99]
listB: [3, 4]

詳細原理分析
這題的關鍵在於 process 函數內部對參數 a 與 b 做了兩種完全不同的操作：

1. 對 a 的操作：修改內容 (Mutating)
動作：a.push(99)

原理：當我們把 listA 傳入函數時，變數 a 拿到的是指向原始陣列的記憶體位址。執行 push 是直接對該位址所指向的「內容」進行變動。

結果：因為 a 和 listA 指向同一個陣列，所以 listA 的內容被改變了。

2. 對 b 的操作：重新賦值 (Re-assigning)
動作：b = [100]

原理：當 listB 傳入時，b 一開始確實也指向 [3, 4] 的位址。但緊接著執行 b = [100]，這行指令是讓 b 改為指向一個全新的記憶體位址（一個新的陣列 [100]）。

結果：這個操作只是切斷了 b 與原始 listB 的連結，並不會回頭去修改 listB 原本指向的那個陣列。因此，外部的 listB 依然維持原樣。
*/