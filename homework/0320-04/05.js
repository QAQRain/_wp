function getTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }
  return total;
}

const myCart = [{name: "奶茶", price: 60}, {name: "雞排", price: 90}];
console.log("總金額:", getTotal(myCart));