import { locate } from "./locateFunctions";

export const getDropZoneId = (placeId: string, gameSnapshot: GameSnapshot): string => {
  const { player, place } = locate(placeId, gameSnapshot);
  if (player != null) {
    if (place === "enchantmentsRow") return "dropZone" + gameSnapshot.players[player].places["GCZ"].id;
  }
  return "dropZone" + placeId;
};
