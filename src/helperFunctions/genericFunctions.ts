export const arraysShareItems = (a: any[], b: any[]) => a.map(i => b.includes(i)).includes(true);

export const arrayExistsIn3dArray = (twoD: any[], threeD: any[][]) => threeD.find(currArray => arraysShareItems(twoD, currArray));

export const filterOutDuplicates = (cardGroups: CardGroup[]) => {
  let accumulator: CardGroup[] = [];
  cardGroups.forEach(currCardGroup => {
    if (!arrayExistsIn3dArray(currCardGroup, accumulator)) accumulator.push(currCardGroup);
  });
  return accumulator;
};