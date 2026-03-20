const user = {
  firstName: "Alex",
  lastName: "Chen",
  getFullName: function() {
    return this.firstName + " " + this.lastName;
  }
};

console.log(user.getFullName());