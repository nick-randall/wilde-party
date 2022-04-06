import { Change } from "../animations/findChanges.ts/findChanges";

/**
 *
 * 1. Create NewSnapshot
 * 2. Create Changes list
 * 3. Create willReceiveCard list
 * ...UI adds an emissary wherever it is on the list
 * 4. as changes come in from the Emissaries
 * append them to changes list and remove them from
 * willReceiveCard list
 * ...
 * changes list is now complete,
 * willReceiveCard is empty
 * 5. Create transitions -- add to TransitionData
 * 6. UI updates based on NewSnapshot / TransitionData
 * 7. transition completes
 * 8. CurrSnapshot copies from NewSnapshot
 * 9. Points, currPlayer, etc. update based on CurrSnapshot
 *
 * NewSnapshot therefore has different 2 states of its own:
 * willReceiveCard not empty then not active,
 * willReceiveCard empty then active.
 *
 * UI listens to currSnapshot if newSnapshot not active
 * else to newSnapshot if active
 *
 *
 *
 *
 * @param changes
 * @param gameSnapshot
 * @returns
 */

const findWillReceiveCard = (changes: Change[]): string[] =>
  changes.reduce((acc, curr) => {
    acc.push(curr.to.placeId);
    return acc;
  }, [] as string[]);
