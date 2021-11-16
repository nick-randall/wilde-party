import produce from "immer";
import { NewDraggedCardData } from "../components/Hand";
import { locate } from "../helperFunctions/locateFunctions";
import { onlyUnique } from "../helperFunctions/rules/updateGameSnapshot";
import { tweakedGameSnapshot } from "../initialGameSnapshot";
import { Action } from "./actions";


export interface State {
  gameSnapshot: GameSnapshot;
  draggedCard: GameCard | undefined;
  draggedCardData: NewDraggedCardData | undefined;
  rearrangingDragGroupData: RearrangingDragGroupData | undefined;
  rearrangingData: NewestRearrangingData | undefined;
  transitionData: TransitionData[];
}

export const stateReducer = (
  state: State = {
    draggedCard: undefined,
    draggedCardData: undefined,
    gameSnapshot: tweakedGameSnapshot,
    rearrangingDragGroupData: undefined,
    rearrangingData: undefined,
    transitionData: [],
  },
  action: Action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case "SET_DRAGGED_CARD": {
        draft.draggedCard = action.payload;
        break;
      }
      case "SET_DRAGGED_CARD_DATA": {
        const cardElement = action.payload.cardRef.current;
        // if (cardElement){
        // const { left, top } = cardElement.getBoundingClientRect();
        // const { offsetLeft, offsetTop } = cardElement;
        // return {
        //   card: action.payload.card,
        //   offsetX: offsetLeft + (mouseEvent.clientX - left),
        //   offsetY: offsetTop + (mouseEvent.clientY - top),
        //   translateX: left - offsetLeft,
        //   translateY: top - offsetTop,

        //   draft.draggedCardData = {
        //     card: action.payload.card,

        //   }}
        break;
      }

      case "SET_REARRANGING_CARDS_DATA": {
        draft.rearrangingData = action.payload;
        console.log(state);
        break;
      }

      case "END_REARRANGE" : {
        draft.rearrangingData = undefined;
        break;
      }

      case "UPDATE_DRAGGED_OVER_INDEX": {
        console.log(action.payload)
        if (draft.rearrangingData) draft.rearrangingData.draggedOverIndex = action.payload;
        break;
      }

      case "UPDATE_REARRANGE": {
        const { draggedCards, newIndex } = action.payload;

        const startIndex = Math.max(...draggedCards.map((card) => card.index));
        const stopIndex = Math.min(...draggedCards.map((card) => card.index));
        const places = draggedCards.map((card) => card.placeId).filter(onlyUnique);

        places.forEach((placeId) => {
          const { place: placeType, player } = locate(placeId, state.gameSnapshot);
          if (player) {
            const splicedCards = draft.gameSnapshot.players[0].places[placeType].cards.splice(stopIndex, startIndex - stopIndex + 1);
            draft.gameSnapshot.players[player].places[placeType].cards.splice(newIndex, 0, ...splicedCards);
            draft.gameSnapshot.players[player].places[placeType].cards.forEach((card, index) => (card.index = index));
          }
        });
        break;
      }
      default:
        return state;
    }
  });

export default stateReducer;
