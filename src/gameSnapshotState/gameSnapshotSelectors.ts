import { RootState } from "../redux/store";

// export const getUserPhase = (state: RootState) => {
export const getUserPhase = (state: RootState): PlayerPhase => {
    const { myIndex } = state.userGameState;
    const { current } = state.gameSnapshotState.currSnapshot;
    if (!current) throw new Error("No current in snapshot");
    if (current.counteringPlayer === myIndex) return "countering";
    if (current.player !== myIndex) return "notMyTurn";
    if (current.draws > 0) return "drawing";
    if (current.rolls > 0) return "rolling";
    if (current.plays > 0) return "playing";
    return "dealing";
};
