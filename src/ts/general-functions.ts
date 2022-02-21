import { GetWordsData } from './request';
export function getRandomNum(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getArrRandomNumbers(arrLength: number, maxNum: number, exception?: number) {
  const numbers: number[] = [];
  for (let i = 0; i < 100; i++) {
    if (numbers.length === arrLength) break;
    const randomNum = getRandomNum(0, maxNum);

    if (randomNum != exception && !numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers;
}

export function shuffle(arr: GetWordsData[]) {
  return arr.sort(() => Math.random() - 0.5);
}
