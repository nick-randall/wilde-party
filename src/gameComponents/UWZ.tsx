import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import Card from "./Card";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import { getCardStyleValues, getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import AnimatedCard from "./AnimatedCard";

interface UWZProps {
    id: number;
    alignment: string;
    player: number;
    gameSnapshot: GameSnapshot;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

export const UWZ = (props: UWZProps) => {
    const { id, alignment, player, gameSnapshot, registerPlaceOffset } = props;
    const myIndex = useSelector((state: RootState) => state.userGameState.myIndex);

    const unwantedCards = gameSnapshot.players[player].places.unwantedsZone.cards;

    const droppableData: DroppableData = {
        type: "place",
        id,
        placeType: "unwantedsZone",
        player: myIndex, // TODO fix for other players
        calculatedIndex: unwantedCards.length,
    };
    const droppableId = JSON.stringify(droppableData);

    const { draggedHandCard, draggedOver, highlights, rearrangingData } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const ghostCardIndex =
        draggedOver?.id === id ? draggedOver.index || 0 : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );

    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const dimensions = getCardStyleValuesFromPlaceAndPlayer("unwantedsZone", player, gameSnapshot);
    const { cardWidth, cardHeight, top } = dimensions;
    return (
        <div
            style={{ transition: "left 180ms", position: "relative" }}
            className={`grid-item ${alignment}`}
            ref={(el) => registerPlaceOffset(el, id)}
        >
            {unwantedCards.map((card, index) =>
                !animationCardIds.includes(card.id) ? (
                    <Card
                        id={card.id}
                        imageName={card.imageName}
                        index={index}
                        offsetTop={getCardStyleValues(card.id, gameSnapshot).top}
                        offsetLeft={getCardStyleValues(card.id, gameSnapshot).left}
                        key={card.id}
                    />
                ) : (
                    <AnimatedCard
                        id={card.id}
                        imageName={card.imageName}
                        key={card.id}
                        currAnimations={animations.filter(
                            (a) => a.cardId === card.id && a.placeId === id
                        )}
                        gameSnapshot={gameSnapshot}
                    />
                )
            )}
            <div style={{ position: "absolute", top: 0 }}>
              <Droppable droppableId={droppableId} isDropDisabled={!allowDropping}>
                  {(provided) => (
                      <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                              position: "relative",
                              // left: unwantedCards.length * 10,
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
                                  offsetLeft={getCardStyleValues(ghostCard.id, gameSnapshot).left}
                                  zIndex={9}
                              />
                          ) : null}
                      </div>
                  )}
              </Droppable>
            </div>
        </div>
    );
};

export default UWZ;
