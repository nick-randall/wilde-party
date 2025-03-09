import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getCardRowShapeOnRearrange,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import { Droppable } from "react-beautiful-dnd";
import "../css/global.css";
import NewCardGroup from "./NewCardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";

interface NewGCZProps {
    id: number;
    gameSnapshot: GameSnapshot;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const NewGCZ: React.FC<NewGCZProps> = ({ id, gameSnapshot, player, registerPlaceOffset }) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { cardWidth, cardHeight } = getCardStyleValuesFromPlaceAndPlayer(
        "guestCardZone",
        player,
        gameSnapshot
    );
    const droppableId = JSON.stringify({ type: "place", id, placeType: "guestCardZone", player });

    const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;
    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;
    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);

    const cardRowShape =
        rearrangingData.placeId === id
            ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex)
            : getCardRowShapeOnDraggedOver(cardRow);
    cardRowShape.unshift(0);

    const ghostCardGroup = cardRow.find((e) => rearrangingData.draggedId === e.id);
    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°

    return (
        <div ref={(el) => registerPlaceOffset(el, id)} style={{ position: "relative" }}>
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
                            position: "relative",
                            display: "flex",
                            // height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
                            height: cardHeight,
                            minWidth: cardWidth,
                        }}
                    >
                        {cardRow.map((cardGroup, index) => (
                            <NewCardGroup
                                cardGroup={cardGroup}
                                cardGroupIndex={index}
                                physicalIndex={cardRowShape[index]}
                                gameSnapshot={gameSnapshot}
                                placeId={id}
                            />
                        ))}
                        {provided.placeholder}
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
            {ghostCardGroup && ghostCardIndex !== undefined && ghostCardIndex !== -1 && (
                <GhostCardGroup ghostCardGroup={ghostCardGroup} index={ghostCardIndex} />
            )}
        </div>
    );
};

export default NewGCZ;
