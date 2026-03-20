function calculateBMI(weight, height) {
  let bmi = weight / (height * height);
  let category;
  if (bmi < 18.5) category = "體重過輕";
  else if (bmi < 24) category = "正常範圍";
  else category = "過重";
  
  return `BMI: ${bmi.toFixed(1)} (${category})`;
}

console.log(calculateBMI(65, 1.7));