import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";

interface UWZProps {
    id: number;
    alignment: string;
    player: number;
}

export const UWZ = (props: UWZProps) => {
    const { id, alignment, player } = props;
    const myIndex = useSelector((state: RootState) => state.userGameState.myIndex);

    const droppableData: DroppableData = {
        type: "place",
        id,
        placeType: "unwantedsZone",
        player: myIndex,
    };
    const droppableId = JSON.stringify(droppableData);

    const { draggedHandCard, draggedOver, highlights, rearrangingData } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { currSnapshot, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const ghostCardIndex = draggedOver?.id === id ? (draggedOver.index || 0) : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );

    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
    const useOldSnapshot = activeAnimation?.showPrevSnapshot.includes(id) ?? true;
    const gameSnapshot = useOldSnapshot ? currSnapshot : newSnapshot!;
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const unwantedCards = gameSnapshot.players[player].places.unwantedsZone.cards;
    const dimensions = getCardStyleValuesFromPlaceAndPlayer("unwantedsZone", player, gameSnapshot);
    const { cardWidth, cardHeight, top } = dimensions;

    return (
        <div style={{ transition: "left 180ms" }} className={`grid-item ${alignment}`}>
            {unwantedCards.map((card, index) => (
                <Card
                    id={card.id}
                    imageName={card.imageName}
                    index={index}
                    offsetTop={index * dimensions.top}
                    key={card.id}
                />
            ))}
            <Droppable droppableId={droppableId} isDropDisabled={!allowDropping}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            position: "relative",
                            top: unwantedCards.length * top,
                            height: cardHeight,
                            minWidth: cardWidth,
                            backgroundColor: isHighlighted ? "yellowgreen" : "",
                            boxShadow: isHighlighted ? "0px 0px 30px 30px yellowgreen" : "",
                            transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                        }}
                    >
                        {provided.placeholder}
                        {ghostCard ? (
                            <GhostCard
                                cardId={ghostCard.id}
                                index={ghostCardIndex}
                                imageName={ghostCard.imageName}
                                zIndex={9}
                            />
                        ) : null}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default UWZ;
