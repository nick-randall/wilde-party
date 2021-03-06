import * as R from "ramda";

// checks whether array in 3d array is unique by comparing first element in array
export const onlyUniqueArrays = (array2d: any[], index: number, array3d: any[][]) => {
  return array3d.map(arr => arr[0]).indexOf(array2d[0]) === index;
};
// sorts the specials into groups according to their type
export const sortSpecials = (array: GameCard[]) =>
  array.map(cardX => array.filter(cardY => cardX.specialsCardType === cardY.specialsCardType)).filter(onlyUniqueArrays);

export const sortSpecials2 = (array: GameCard[]) => R.groupWith<GameCard>((a, b) => a.specialsCardType === b.specialsCardType, array);

// returns all specials of particular type based on "type index"
export const getSpecialsOfType = (array: GameCard[], typeIndex: number): GameCard[] =>
  sortSpecials2(array).length - 1 >= typeIndex ? sortSpecials2(array)[typeIndex] : [];

// returns the type of specials in the array of "type index"
export const getTypeofSpecials = (array: GameCard[], typeIndex: number) =>
  getSpecialsOfType(array, typeIndex).length > 0 ? getSpecialsOfType(array, typeIndex)[0].specialsCardType : undefined;

// returns the index any new specials card should have
export const getNextIndexOfSpecialsType = (cards: GameCard[], typeToFind: GuestCardType, index: number): number => {
  if (cards.length === 0) return 0;
  if (!cards.map(c => c.specialsCardType).includes(typeToFind)) return cards.slice(0, index).reduce((acc, curr) => curr.length + acc, 0);
  const specialsColumns = sortSpecials(cards);
  let cardCount = 0;
  let currentType = specialsColumns[0][0].specialsCardType;
  console.log("current type is " + currentType);
  for (let column of specialsColumns) {
    if (currentType === typeToFind) {
      return (cardCount += column.length);
    } else {
      currentType = column[0].specialsCardType || "";
      cardCount += column.length;
    }
  }
  return cardCount;
};

export const getNextIndexOfSpecialsType2 = (array: GameCard[], startIndex: number) =>
  array.splice(startIndex, array.length).find(card => card.specialsCardType !== array.splice(startIndex, array.length)[0].specialsCardType);
