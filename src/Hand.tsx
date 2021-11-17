import { useRef, useState } from "react";
import { handDimensions } from "./handDimensions";
import HandCard from "./HandCard";
import { myHandCards } from "./initialCards";
import { DragDropContext, Draggable, DragStart, Droppable } from "react-beautiful-dnd";
interface HandProps {
  id: string;
  // //children: React.ReactNode;
  // cards: GameCard[];
  // numCards: number;

  // // only for passing down to cards!
  // gameSnapshot: GameSnapshot;
  // legalTargets: LegalTarget[];
  // dimensions: PlaceDimensions;
  // transitionData: TransitionData[];
  // removeCardTransition: (returnedCardId: string) => void;
}

const handCards = myHandCards;
const dimensions = handDimensions;
const transitionData: TransitionData[] = [];

const Hand = (props: HandProps) => {
  //const { numCards, dimensions, cards, gameSnapshot, legalTargets, removeCardTransition, transitionData } = props;

  const [spread, setSpread] = useState<number>(35);
  // const draggedCard = useSelector<State, State["draggedCard"]>((state) => state.draggedCard);
  // const dispatch = useDispatch();

  // const onCardDragStart = (card: GameCard, cardRef: React.RefObject<HTMLImageElement>): Action =>
  //   dispatch({ type: "SET_DRAGGED_CARD_DATA", payload: { card: card, cardRef: cardRef } });

  return (
    // <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="handpl0">
        {provided => (
          <div
            id={props.id}
            onMouseEnter={() => setSpread(120)}
            onMouseLeave={() => setSpread(35)}
            style={{
              position: "absolute",
              //top: dimensions.topOffset,
              bottom: 200,
              left: 700,
              //width: numGuestCards * dimensions.cardLeftSpread,
              height: dimensions.cardHeight,
              //pointerEvents: legalTargetStatus === "notAmongLegalTargets" || rearranging ? "none" : "auto",
            }}
            ref={provided.innerRef}
          >
            {handCards.map((card, index) => (
                  <HandCard
                    id={card.id}
                    index={index}
                    image={card.image}
                    spread={spread}
                    dimensions={handDimensions}
                    transitionData={transitionData.find(trans => trans.card.id === card.id)}
                    numHandCards={handCards.length}
                    key={card.id}
                  />
               
            ))}
            {provided.placeholder}
          </div>
          
        )}
        
      </Droppable>
    // </DragDropContext>
  );
};

export default Hand;
