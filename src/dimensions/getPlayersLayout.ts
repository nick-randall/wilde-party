import { getAllDimensions } from "../helperFunctions/getDimensions";
import locatePlayer from "../helperFunctions/locateFunctions/locatePlayer";
import store, { RootState } from "../redux/store";

export interface PlayerLayout {
  height: number;
  width: number;
  x: number;
  y: number;
}

const getEnemyPlayerHeight = (player: number | null, gameSnapshot: GameSnapshot, screenHeight: number) => {
  if(player === null) return 0;
  // increases player height when it is players' turn, so the player's hand can be seen
  const playerIsCurrentPlayer = gameSnapshot.current.player === player;
  const handHeight = getAllDimensions(gameSnapshot.players[player].places["hand"].id).cardHeight;
  return (screenHeight / 2) + (playerIsCurrentPlayer ? handHeight : 0)
}

const getPlayersLayout = (screenSize: { width: number; height: number }, playerId: string | null, state: RootState | null = null): PlayerLayout => {
  if (state === null) state = store.getState();
  const { gameSnapshot } = state;
  let player: number | null;
  if (playerId === null) player = null;
  // else player = gameSnapshot.players.map(p => p.id).indexOf(playerId);
  else player = locatePlayer(playerId, gameSnapshot)
  

  const playerZoneWidth = player === 0 ? 500 : 250;
  const playerZoneHeight = player === 0 ? screenSize.height : getEnemyPlayerHeight(player, gameSnapshot, screenSize.height);
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
      playerZonePosition = { x: fromCenterWidth(400), y: -10 };
      break;
    case 1:
      playerZonePosition = { x: 200, y: 0 };
      break;
    case 2:
      playerZonePosition = { x: 200, y: fromBottom(playerZoneHeight+50) };
      break;
    default:
      playerZonePosition = { x: 0, y: 0 };
      break;
  }
  return { ...playerZonePosition, height: playerZoneHeight, width: playerZoneWidth };
};

export default getPlayersLayout;
