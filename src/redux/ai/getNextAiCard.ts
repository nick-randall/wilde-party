export const cleverGetNextAiCard = (player: number, gameSnapshot: GameSnapshot) => {
  const numHandCards = gameSnapshot.players[player].places.hand.cards.length;
  if (numHandCards > 0) {
    const randomCardIndex = Math.floor(Math.random() * numHandCards);
    return gameSnapshot.players[player].places.hand.cards[randomCardIndex];
  } else return undefined;
};
