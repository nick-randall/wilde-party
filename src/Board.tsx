import { useReducer } from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import GCZ from "./GCZ";
import Hand from "./Hand";
import { locate3 } from "./helperFunctions/locateFunctions";
import { getCardGroupObjs, getCardRowShapeOnRearrange } from "./helperFunctions/groupGCZCards";

export const Board = () => {
  const dispatch = useDispatch();

  const gameSnapshot = useSelector((state: RootState) => state.gameSnapshot);

  const handleDragStart = (data: DragStart) => {
    const sourceId = data.source.droppableId;
    const { player, place } = locate3(sourceId);
    switch (place) {
      // here assuming that it is player 0, since opponents' GCZ will be disabled
      case "GCZ":
        const sourceIndex = data.source.index;
        const draggableId = data.draggableId;
        const GCZ = gameSnapshot.players[0].places.GCZ;
        const enchantmentsRow = gameSnapshot.players[0].places.enchantmentsRow;
        const GCZRow = getCardGroupObjs(enchantmentsRow.cards, GCZ.cards);
        const GCZRowShape = getCardRowShapeOnRearrange(GCZRow, sourceIndex);
        dispatch({
          type: "START_GCZ_REARRANGE",
          payload: {
            cardRowShape: GCZRowShape,
            index: sourceIndex,
            ghostCardsObject: GCZRow.filter(cardGroup => cardGroup.id === draggableId)[0],
          },
        });
    }

    console.log(data.source.droppableId);
  };

  const handleDragEnd = (data: DropResult) => {
    console.log(data.destination);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div>
        {" "}
        <GCZ /> <Hand id="" />{" "}
      </div>
    </DragDropContext>
  );
};
