import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
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
import ExperimentCardGroup from "./ExperimentCardGroup";

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
    const droppableId = JSON.stringify({ type: "place", id, placeType: "guestCardZone", player });

    const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;
    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;
    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const cardRowShape =
        rearrangingData.placeId === id
            ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex)
            : getCardRowShapeOnDraggedOver(cardRow);
    console.log("cardrow", cardRow);
    console.log("cardRowShape", cardRowShape);
    cardRowShape.unshift(0);

    const ghostCardGroup = cardRow.find((e) => rearrangingData.draggedId === e.id);
    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°

    return (
        <div ref={(el) => registerPlaceOffset(el, id)}>
            <Droppable
                droppableId={droppableId}
                direction="horizontal"
                isDropDisabled={!allowDropping}
            >
                {(provided) => (
                    <div
                        className={`pl0GCZ ${isHighlighted ? "highlighted" : ""}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            margin: 0,
                            border: "1px solid black",
                            position: "relative",
                            display: "flex",
                            // height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
                            height: cardHeight,
                            minWidth: cardWidth,
                        }}
                    >
                        {cardRow.map((cardGroup, index) =>
                            !animationCardIds.includes(cardGroup.id) ? (
                                <ExperimentCardGroup
                                    cardGroup={cardGroup}
                                    cardGroupIndex={index}
                                    physicalIndex={cardRowShape[index]}
                                />
                            ) : (
                                // <Draggable draggableId={JSON.stringify({})} index={index}>
                                //     {(d) => (
                                //         <img
                                //             {...d.draggableProps}
                                //             ref={d.innerRef}
                                //             {...d.dragHandleProps}
                                //             src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                                //             alt={cardGroup.cards[0].imageName}
                                //             draggable="false"
                                //             style={{
                                //                 // position: "absolute",
                                //                 height: cardHeight,
                                //                 width: cardWidth,
                                //                 zIndex: 99,
                                //                 ...d.draggableProps.style,
                                //                 borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                                //             }}
                                //         />
                                //     )}
                                // </Draggable>
                                <AnimatedCard
                                    key={cardGroup.id}
                                    id={cardGroup.id}
                                    currAnimations={animations.filter(
                                        (a) => a.cardId === cardGroup.id && a.placeId === id
                                    )}
                                    imageName={cardGroup.cards[0].imageName}
                                    index={index}
                                    gameSnapshot={gameSnapshot}
                                />
                            )
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default NewGCZ;
