

export const moveItem = (currIndex: number, newIndex: number, array: any) => {
  const splicedCard = array.splice(currIndex, 1);
  array.splice(newIndex, 0, splicedCard);
  return array;
};


// const curriedNormalizePlaceCardsFromSnapshot = (gameSnapshot: GameSnapshot) => (placeId: string) =>
//   R.pipe(getCardGroupObjsFromSnapshot, filterAllByPlace(placeId), extractCards, assignNewIndexes, R.flatten)(gameSnapshot);

// export const normalizePlaceCards = (gameSnapshot: GameSnapshot, placeId: string) => curriedNormalizePlaceCardsFromSnapshot(gameSnapshot)(placeId);


// export const rearrange = (currIndex: number, newIndex: number, gameSnapshot: GameSnapshot) =>
// R.pipe(getCardGroupObjsFromSnapshot, moveItem(currIndex, newIndex, gameSnapshot))(gameSnapshot);


