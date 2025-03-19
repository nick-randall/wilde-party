import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getWidthShapeOnDraggedOver,
    getWidthShapeOnRearrange,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import { Droppable } from "react-beautiful-dnd";
import "../css/global.css";
import NewCardGroup from "./NewCardGroup";
import GhostCard from "./GhostCard";
import GhostCardGroup from "./GhostCardGroup";

interface GCZProps {
    id: number;
    gameSnapshot: GameSnapshot;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const GCZ: React.FC<GCZProps> = ({ id, gameSnapshot, player, registerPlaceOffset }) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { cardWidth, cardHeight } = getCardStyleValuesFromPlaceAndPlayer(
        "guestCardZone",
        player,
        gameSnapshot
    );
    const droppableId = JSON.stringify({ type: "place", id, placeType: "guestCardZone", player });

    // const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;

    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;
    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);
    const cardWidthShape = draggedHandCard ? getWidthShapeOnDraggedOver(cardRow) : getWidthShapeOnRearrange(cardRow, rearrangingData.sourceIndex);
    const ghostCardIndex =
        draggedOver?.id === id ? draggedOver.index : cardWidthShape[draggedOver?.index || 0];

    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

    console.log(cardWidthShape);
    // Figure out which cards are the rightmost enchantable cards
    const actionResultsMap = gameSnapshot.actionResultsMap;
    const rightMostEnchantableCardIds: number[] = [];
    if (actionResultsMap) {
        for (const cardGroup of cardRow) {
            const cardGroupId = cardGroup.cards[0].id;
            const actionResults = Object.values(actionResultsMap)
                .flat()
                .filter((actionResult) => {
                    return actionResult.snapshotUpdateData.targetId === cardGroupId;
                });
            if (!actionResults) continue;
            for (const actionResult of actionResults) {
                if (actionResult.snapshotUpdateData.secondaryCardId !== null) {
                    rightMostEnchantableCardIds.push(cardGroupId);
                }
            }
        }
    }

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
                                key={cardGroup.id + "-" + index}
                                cardGroup={cardGroup}
                                cardGroupIndex={index}
                                // physicalIndex={cardRowShape[index]}
                                gameSnapshot={gameSnapshot}
                                placeId={id}
                                rightMostEnchantable={rightMostEnchantableCardIds.includes(
                                    cardGroup.id
                                )}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {ghostCard && draggedHandCard && (
                <GhostCard
                    cardId={draggedHandCard.id}
                    index={cardWidthShape[draggedOver?.index ?? 0]}
                    imageName={draggedHandCard.imageName}
                    zIndex={0}
                />
            )}
            {ghostCardGroup && ghostCardIndex !== undefined && ghostCardIndex !== -1 && (
                <GhostCardGroup
                    ghostCardGroup={ghostCardGroup}
                    physicalIndex={cardWidthShape ? cardWidthShape[ghostCardIndex] : 0}
                />
            )}
        </div>
    );
};

export default GCZ;
