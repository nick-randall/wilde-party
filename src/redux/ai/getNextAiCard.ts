export const cleverGetNextAiCard = (player: number, gameSnapshot: GameSnapshot) => {
  if (gameSnapshot.players[player].places.hand.cards.length > 0)
  return gameSnapshot.players[player].places.hand.cards[0];
  else return undefined;
}