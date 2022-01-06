import store, { RootState } from "../redux/store";

export interface PlayerLayout {
  height: number;
  width: number;
  x: number;
  y: number;
}

const getPlayersLayout = (screenSize: { width: number; height: number }, playerId: string | null, state: RootState | null = null): PlayerLayout => {
  if (state === null) state = store.getState();
  const { gameSnapshot } = state;
  let player: number | null;
  if (playerId === null) player = null;
  else player = gameSnapshot.players.map(p => p.id).indexOf(playerId);

  const playerZoneWidth = player === 0 ? 500 : 250;
  const playerZoneHeight = player === 0 ? 700 : 400;
  // need null case for deck and discardpile

  const fromCenterWidth = (distance: number): number => distance + (screenSize.width / 2 - playerZoneWidth / 2);
  const fromCenterHeight = (distance: number): number => distance + (screenSize.height / 2 - playerZoneHeight / 2);
  const fromRight = (distance: number) => screenSize.width - distance;
  const fromBottom = (distance: number) => screenSize.height - distance;

  let playerZonePosition = { x: 0, y: 0 };

  switch (player) {
    case null:
      playerZonePosition = { x: fromCenterWidth(0), y: fromCenterHeight(0) };
      break;
    case 0:
      playerZonePosition = { x: fromCenterWidth(400), y: 0 };
      break;
    case 1:
      playerZonePosition = { x: 200, y: fromCenterHeight(200) };
      break;
    case 2:
      playerZonePosition = { x: 200, y: fromCenterHeight(-200) };
      break;
    default:
      playerZonePosition = { x: 0, y: 0 };
      break;
  }
  return { ...playerZonePosition, height: playerZoneHeight, width: playerZoneWidth };
};

export default getPlayersLayout;
