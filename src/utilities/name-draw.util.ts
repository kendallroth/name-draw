import { getNextItem, shuffle } from "./list.util";
import { sleep } from "./sleep.util";

import type { GiverRecipient, NameWithExclusions } from "@typings/name.types";

export const matchGiverRecipients = async <T extends NameWithExclusions>(
  names: T[],
): Promise<GiverRecipient[]> => {
  await sleep(500);

  // Shuffle names to allow easily finding unique matches by matching with next available name
  //   in the shuffled array (respecting exclusions, etc).
  const shuffledNames = shuffle(names, 10);

  const nameMap = shuffledNames.reduce(
    (accum: Record<string, T>, name) => ({ ...accum, [name.id]: name }),
    {},
  );

  const matchIds: Record<string, string> = {};
  for (let idx = 0; idx < shuffledNames.length; idx++) {
    const currentEntry = shuffledNames[idx];
    const nextEntry = getNextItem(idx, shuffledNames);
    matchIds[currentEntry.id] = nextEntry.id;
  }

  return Object.entries(matchIds).reduce(
    (accum: GiverRecipient[], [giverId, recipientId]) => [
      ...accum,
      { giver: nameMap[giverId], recipient: nameMap[recipientId] },
    ],
    [],
  );
};
