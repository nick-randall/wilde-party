import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getCardRowShapeOnRearrange,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import { Draggable, Droppable } from "react-beautiful-dnd";
import NewCardGroup from "./NewCardGroup";
import { getEnchantableNeighbours } from "../helperFunctions/canEnchantNeighbour";
import AnimatedCard from "./AnimatedCard";
import "../css/global.css";

interface NewGCZProps {
    id: number;
    gameSnapshot: GameSnapshot;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

export const testCardRow = () => {
    const row: GameCard[] = [
        {
            id: 1,
            cardType: "guest",
            name: "guest1",
            imageName: "guest1",
            guestCardType: "rumgroelerin",
            pointValue: 1,
            action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
            actionType: "addDragged",
        },

        {
            id: 1,
            cardType: "bff",
            name: "bff1",
            imageName: "bff1",
            pointValue: 1,
            action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
            actionType: "addDragged",
        },
    ];
    const cardRow = getCardGroupsObjs(row);
};

const NewGCZ: React.FC<NewGCZProps> = ({ id, gameSnapshot, player, registerPlaceOffset }) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { cardWidth, cardHeight } = getCardStyleValuesFromPlaceAndPlayer(
        "guestCardZone",
        player,
        gameSnapshot
    );
    // console.log(GCZCards);
    const droppableId = JSON.stringify({ type: "place", id });

    const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;
    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const isHighlighted = useSelector((state: RootState) =>
        state.dragEventState.highlights.includes(id)
    );
    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    console.log(GCZCards.map((c) => c.imageName));

    const allowDropping = isHighlighted || rearranging;
    return (
        <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={!allowDropping}>
            {(drop) => (
                <div
                    ref={drop.innerRef}
                    {...drop.droppableProps}
                    style={{
                        height: cardHeight,
                        width: cardWidth * GCZCards.length,
                    }}
                >
                    <div ref={(el) => registerPlaceOffset(el, id)}>
                        {GCZCards.map((card, index) => {
                            const draggableData: DraggableData = { id: card.id, type: "cardGroup" };
                            const draggableId = JSON.stringify(draggableData);

                            return (
                                <Draggable draggableId={draggableId} index={index}>
                                    {(d) => (
                                        <div
                                            {...d.draggableProps}
                                            ref={d.innerRef}
                                            {...d.dragHandleProps}
                                        >
                                            <img
                                                src={`./images/${card.imageName}.jpg`}
                                                alt="id"
                                                draggable={false}
                                                style={{
                                                    position: "absolute",
                                                    height: cardHeight,
                                                    width: cardWidth,
                                                    zIndex: 99,
                                                }}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {drop.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

export default NewGCZ;
