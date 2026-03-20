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