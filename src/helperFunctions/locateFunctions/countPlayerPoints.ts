import store from "../../redux/store";
import locatePlayer from "./locatePlayer";

const countPlayerPoints = (playerIdOrNumber: number | string, gameSnapshot: GameSnapshot | null = null) => {
  let player: number | null;
  let playerPoints: number = 0;
  if (gameSnapshot === null) gameSnapshot = store.getState().gameSnapshot;
  if (typeof playerIdOrNumber === "string") player = locatePlayer(playerIdOrNumber);
  else player = playerIdOrNumber;
  if (player !== null) {
    const playerSpecialsCards = gameSnapshot.players[player].places.specialsZone.cards;
    const enchantmentsCards = gameSnapshot.players[player].places.enchantmentsRow.cards;
    const guestCards = gameSnapshot.players[player].places.GCZ.cards;

    guestCards.forEach(guestCard => {
      const specialsWithCorrectType = playerSpecialsCards.filter(
        specialsCard => guestCard.guestCardType && specialsCard.specialsCardType === guestCard.guestCardType
      );
      playerPoints += specialsWithCorrectType.length;
      playerPoints += 1;
    });

    enchantmentsCards.forEach(enchantmentsCard => (playerPoints += enchantmentsCard.pointValue));
  }
  return playerPoints
};

export default countPlayerPoints;
