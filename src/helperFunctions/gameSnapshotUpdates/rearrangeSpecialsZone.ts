import produce from "immer";
import { flatten, pipe } from "ramda";
import { sortSpecials2 } from "../getSpecialsOfType";
import { addZeroAtFirstIndex, getCumulativeSum } from "../groupGCZCards";
import { compareProps } from "../tests";
import { setAttributes } from "./addDragged";

const removeSourceIndex = (sourceIndex: number, array: any[]) => array.filter((_, index) => index !== sourceIndex);

const columnLengthsAsArray = (specialsZoneColumns: GameCard[][]) => specialsZoneColumns.map(col => col.length);

const getColumnShape = (specialsZoneColumns: GameCard[][]) => pipe(columnLengthsAsArray, addZeroAtFirstIndex, getCumulativeSum)(specialsZoneColumns);

const getColumnShapeWhenRearranging = (sourceIndex: number, specialsZoneColumns: GameCard[][]) => {
  const columnLengths = columnLengthsAsArray(specialsZoneColumns);
  const columnLengthsRemovedSourceIndex = removeSourceIndex(sourceIndex, columnLengths);
  return pipe(columnLengthsAsArray, addZeroAtFirstIndex, getCumulativeSum)(columnLengthsRemovedSourceIndex);
};

export const rearrangeSpecialsZone = (gameSnapshot: GameSnapshot, currColumnIndex: number, newColumnIndex: number) =>
  produce(gameSnapshot, draft => {
    const specialsZoneColumns = sortSpecials2(gameSnapshot.players[0].places["specialsZone"].cards);
    const [splicedColumn] = specialsZoneColumns.splice(currColumnIndex, 1);
    specialsZoneColumns.splice(newColumnIndex, 0, splicedColumn);
    draft.players[0].places["specialsZone"].cards = flatten(specialsZoneColumns);
    draft.players[0].places["specialsZone"].cards = draft.players[0].places["specialsZone"].cards.map((c, i) => ({ ...c, index: i }));
    compareProps(draft.players[0].places["specialsZone"].cards)
  });
