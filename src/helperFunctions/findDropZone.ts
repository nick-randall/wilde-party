import { locate } from "./locateFunctions";

export const getDropZoneId = (placeId: number, gameSnapshot: GameSnapshot): string => {
  const { player, place } = locate(placeId, gameSnapshot);
  if (player != null) {
    if (place === "enchantmentsRow") return "dropZone" + gameSnapshot.players[player].places["guestCardZone"].id;
  }
  return "dropZone" + placeId;
};
