function countdown(n) {
  let output = [];
  while (n >= 0) {
    output.push(n);
    n--;
  }
  return output.join(", ") + " ... Liftoff!";
}

console.log(countdown(5));