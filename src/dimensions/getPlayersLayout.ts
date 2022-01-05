import { getAllDimensions } from "../helperFunctions/getDimensions";
import { locate } from "../helperFunctions/locateFunctions";
import store, { RootState } from "../redux/store";

const getPlayersLayout = (
  screenSize: { width: number; height: number },
  playerId: string,
  state: RootState | null = null
): { x: number; y: number; width: number; height: number } => {
  if (state === null) state = store.getState();
  const { gameSnapshot, dragUpdate, draggedHandCard } = state;
  const player = gameSnapshot.players.map(p => p.id).indexOf(playerId)
  console.log(player)
  const dimensions = getAllDimensions(playerId, gameSnapshot);
  const { cardHeight, cardWidth, cardLeftSpread } = dimensions;

  const playerZoneWidth = player === 0 ? 400 : 250;
  const playerZoneHeight = player === 0 ? 700 : 450;
  // need null case for deck and discardpile

  const fromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - playerZoneWidth / 2);
  const fromCenterHeight = (distance: number): number => distance + (screenSize.height / 2 - playerZoneHeight / 2);
  const fromRight = (distance: number) => screenSize.width - distance;
  const fromBottom = (distance: number) => screenSize.height - distance;

  let playerZonePosition = { x: 0, y: 0 };

  switch (player) {
    case 0:
      playerZonePosition = { x: fromCenterWidth(300), y: 200 };
      break;
    case 1:
      playerZonePosition = { x: 200, y: 200 };
      break;
    case 2:
      playerZonePosition = { x: 200, y: 500 };
      break;
    default:
      playerZonePosition = { x: 0, y: 0 };
      break;
  }
  console.log(playerZonePosition)
  return { ...playerZonePosition, height: playerZoneHeight, width: playerZoneWidth };
};

export default getPlayersLayout;
