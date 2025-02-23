import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { dimensionConstants, getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
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
import GhostCard from "./GhostCard";

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
    const myIndex = useSelector((state: RootState)=> state.userGameState.myIndex);

    const droppableData: DroppableData = {
        type: "place",
        id,
        placeType: "guestCardZone",
        player: myIndex,
    };
    const droppableId = JSON.stringify(droppableData);

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

    const allowDropping = isHighlighted || rearranging;
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    return (
        <div ref={(el) => registerPlaceOffset(el, id)} style={{ position: "relative" }}>
            <Droppable
                droppableId={droppableId}
                direction="horizontal"
                isDropDisabled={!allowDropping}
            >
                {(drop) => (
                    <div
                        className={`pl0GCZ ${isHighlighted ? "highlighted" : ""}`}
                        ref={drop.innerRef}
                        {...drop.droppableProps}
                        style={{
                            transition: "300ms",
                            margin: 0,
                            height: cardHeight,
                            width:
                                cardWidth * GCZCards.length +
                                (draggedOver?.id === id ? cardWidth : 0),
                            display: "flex",
                        }}
                    >
                        {GCZCards.map((card, index) => {
                            const DroppableData: DroppableData = {
                                id: card.id,
                                type: "cardGroup",
                            };
                            const draggableId = JSON.stringify(DroppableData);

                            return !animationCardIds.includes(card.id) ? (
                                <Draggable draggableId={draggableId} index={index}>
                                    {(d) => (
                                        <img
                                            {...d.draggableProps}
                                            ref={d.innerRef}
                                            {...d.dragHandleProps}
                                            src={`./images/${card.imageName}.jpg`}
                                            alt={card.imageName}
                                            draggable="false"
                                            style={{
                                                // position: "absolute",
                                                height: cardHeight,
                                                width: cardWidth,
                                                zIndex: 99,
                                                ...d.draggableProps.style,
                                                borderRadius: dimensionConstants.CARD_BORDER_RADIUS
                                            }}
                                        />
                                    )}
                                </Draggable>
                            ) : (
                                <AnimatedCard
                                    key={card.id}
                                    id={card.id}
                                    currAnimations={animations.filter(
                                        (a) => a.cardId === card.id && a.placeId === id
                                    )}
                                    imageName={card.imageName}
                                    index={index}
                                    gameSnapshot={gameSnapshot}
                                />
                            );
                        })}
                        {drop.placeholder}
                    </div>
                )}
            </Droppable>
            {ghostCard && draggedHandCard && (
                <GhostCard
                    cardId={draggedHandCard.id}
                    index={draggedOver?.index ?? 0}
                    imageName={draggedHandCard.imageName}
                    zIndex={0}
                />
            )}
        </div>
    );
};

export default NewGCZ;
