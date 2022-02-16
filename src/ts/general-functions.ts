export function getRandomNum(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getArrRandomNumbers() {
  const numbers: number[] = [];
  for (let i = 0; i < 100; i++) {
    if (numbers.length === 4) break;
    const randomNum = getRandomNum(0, 29);
    if (numbers.every((num) => num !== randomNum)) {
      numbers.push(randomNum);
    } else continue;
  }
  return numbers;
}
