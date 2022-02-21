const url = 'https://anna-learnenglish.herokuapp.com';
const urlWords = url + '/words';

export interface GetWordsData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export async function getWords(group: number, page: number): Promise<GetWordsData[]> {
  const result = await fetch(`${urlWords}?group=${group}&page=${page}`);
  return result.json();
}
