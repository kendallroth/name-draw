import { getNextIdx, getNextItem } from "../list.util";

describe.concurrent("getNextIdx", () => {
  describe.concurrent("handles simple array", () => {
    const simpleList = [1, 2, 3, 4, 5];
    const cases = [
      { idx: 0, nextIdx: 1 },
      { idx: 1, nextIdx: 2 },
      { idx: 3, nextIdx: 4 },
      { idx: 4, nextIdx: 0 },
    ];

    test.each(cases)("finds '$nextIdx' as the next index after '$idx'", (caseArgs) => {
      const nextIdx = getNextIdx(caseArgs.idx, simpleList);

      expect(nextIdx).toBe(caseArgs.nextIdx);
    });
  });

  describe.concurrent("handles short arrays", () => {
    const cases = [
      { description: "empty", list: [], idx: 0, nextIdx: 0 },
      { description: "single item", list: [1], idx: 0, nextIdx: 0 },
    ];

    test.each(cases)("handles $description list", (caseArgs) => {
      const nextIdx = getNextIdx(caseArgs.idx, caseArgs.list);

      expect(nextIdx).toBe(caseArgs.nextIdx);
    });
  });
});

describe.concurrent("getNextItem", () => {
  const list = [{ key: 1 }, { key: 2 }, { key: 3 }];

  const cases = [
    { idx: 0, nextItem: list[1] },
    { idx: 1, nextItem: list[2] },
    { idx: 2, nextItem: list[0] },
  ];

  test.each(cases)("gets next item after '$idx'", (caseArgs) => {
    const nextItem = getNextItem(caseArgs.idx, list);

    expect(nextItem).toStrictEqual(caseArgs.nextItem);
  });
});
