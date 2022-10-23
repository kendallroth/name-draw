import { randomNumber } from "./random.util";

export const getNextIdx = (currentIdx: number, list: unknown[]): number => {
  return currentIdx < list.length - 1 ? currentIdx + 1 : 0;
};

export const getNextItem = <T>(currentIdx: number, list: T[]): T => {
  return list[getNextIdx(currentIdx, list)];
};

/**
 * Shuffle a list via Fisher-Yates Shuffle
 *
 * @source https://stackoverflow.com/a/2450976/4206438
 */
export const shuffle = <T>(list: T[], iterations = 1): T[] => {
  const randomizedList = [...list];

  let currentIdx = randomizedList.length;
  let randomIdx = 0;

  while (currentIdx != 0) {
    randomIdx = randomNumber(0, currentIdx);
    currentIdx--;

    // Swap remaining element with current element
    [randomizedList[currentIdx], randomizedList[randomIdx]] = [randomizedList[randomIdx], randomizedList[currentIdx]]; // prettier-ignore
  }

  return iterations > 1 ? shuffle(randomizedList, iterations - 1) : randomizedList;
};

export const randomFromList = <T>(list: T[]): [item: T, idx: number] => {
  const randomIdx = randomNumber(0, list.length);
  return [list[randomIdx], randomIdx];
};
