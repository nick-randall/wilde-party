/**
 * Adds a new snapshot to the stack. The new snapshot 
 * @param newSnapshot 
 * @param changes 
 * @returns 
 */

export const  setNewSnapshot = (newSnapshot: GameSnapshot, changes: SnapshotChange[]): SetNewSnapshot => ({
  type: "SET_NEW_SNAPSHOT",
  payload: { newSnapshot, changes },
});

export const updateSnapshot = (gameSnapshot: GameSnapshot): UpdateSnapshot => ({type: "UPDATE_SNAPSHOT", payload: gameSnapshot});