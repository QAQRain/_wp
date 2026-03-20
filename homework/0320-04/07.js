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