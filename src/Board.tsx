import { DragDropContext, DragStart, DragUpdate, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { locate3 } from "./helperFunctions/locateFunctions";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";
import { getIdListObject } from "./helperFunctions/getIdList";

export const Board = () => {
  const dispatch = useDispatch();

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);
  const ids = getIdListObject(gameSnapshot);

  const handleDragStart = (data: DragStart) => {
    const sourceId = data.source.droppableId;
    const { place } = locate3(sourceId);
    console.log(place)
    switch (place) {
      case "hand":
        console.log("hand card dragging")
        console.log(data.draggableId)
        const cardId = data.draggableId;
        dispatch({type: "SET_HAND_CARD_DRAG", payload: cardId})
        break;
      // here assuming that it is player 0, since opponents' GCZ will be disabled
      case "GCZ":
        const sourceIndex = data.source.index;
        const draggableId = data.draggableId;
        const GCZCards = gameSnapshot.players[0].places.GCZ.cards;
        const enchantmentsRow = gameSnapshot.players[0].places.enchantmentsRow;
        const GCZRow = getCardGroupObjs(enchantmentsRow.cards, GCZCards);
        const GCZRowShape = getCardRowShapeOnRearrange(GCZRow, sourceIndex);
        dispatch({
          type: "START_GCZ_REARRANGE",
          payload: {
            cardRowShape: GCZRowShape,
            index: GCZRowShape[sourceIndex],
            ghostCardsObject: GCZRow.filter(cardGroup => cardGroup.id === draggableId)[0],
          },
        });
    }

    console.log(data.source.droppableId);
  };

  const handleDragUpdate = (data: DragUpdate) => {
    const sourceId = data.source.droppableId;
    const { place: sourcePlace } = locate3(sourceId);
    switch (sourcePlace) {
      // here assuming that it is player 0, since opponents' GCZ will be disabled
      case "GCZ":
        const newIndex = data.destination?.index;
        dispatch({
          type: "UPDATE_GCZ_REARRANGING_INDEX",
          payload: newIndex,
        });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const sourceId = result.source.droppableId;
    if (result.destination) {
      console.log(result.destination.index);
      const destinationId = result.destination.droppableId;
      if (destinationId === sourceId) {
      }
    }
    // need to differentiate between dragging to new index
    // and just droppping into nothing (destination === undefined)

    const targetIndex = result.destination?.index;
    const { place: sourcePlace } = locate3(sourceId);
    switch (sourcePlace) {
      // here assuming that it is player 0, since opponents' GCZ will be disabled
      case "GCZ":
        dispatch({
          type: "END_GCZ_REARRANGE",
          payload: { targetIndex: targetIndex },
        });
    }
    console.log(result.destination);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd}>
      <div>
        {" "}
        <GCZ
          id={ids.pl0GCZ}
          enchantmentsRowCards={gameSnapshot.players[0].places.enchantmentsRow.cards}
          GCZCards={gameSnapshot.players[0].places.GCZ.cards}
        />{" "}
        <Hand id={ids.pl0hand} />
      </div>
    </DragDropContext>
  );
};
