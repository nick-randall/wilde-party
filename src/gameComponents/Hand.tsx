import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import AnimatedCard from "./AnimatedCard";
import HandCard from "./HandCard";
import { getPlayerHandOffset } from "../animations/animationHelperFunctions";

interface NewHandProps {
    id: number;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}
const NewHand: React.FC<NewHandProps> = ({ id, player, registerPlaceOffset }) => {
    const { currSnapshot, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );

    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const { MAX_HAND_CARD_LEFT_SPREAD, MIN_HAND_CARD_LEFT_SPREAD } = dimensionConstants;
    const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);

    const myIndex = useSelector((state: RootState) => state.userGameState.myIndex);

    const enemysTurn = useSelector(
        (state: RootState) => state.gameSnapshotState.currSnapshot.current.player !== myIndex
    );

    const droppableData: DroppableData = { type: "place", id, placeType: "hand", player: myIndex };
    const droppableId = JSON.stringify(droppableData);

    const useOldSnapshot = activeAnimation?.showPrevSnapshot.includes(id) ?? true;
    const gameSnapshot = useOldSnapshot ? currSnapshot : newSnapshot!;
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const styles = getCardStyleValuesFromPlaceAndPlayer("hand", player, currSnapshot);
    // const { left: cardLeftSpread } = styles;
    const [shouldSpread, setShouldSpread] = useState(false);
    const [spread, setSpread] = useState(MIN_HAND_CARD_LEFT_SPREAD);
    const cards = gameSnapshot.players[player].places.hand.cards;

    const [spreadOffset, setSpreadOffset] = useState(
        (cards.length * MIN_HAND_CARD_LEFT_SPREAD) / 2
    );
    useEffect(() => {
        if (shouldSpread) {
            if (!activeAnimation && !handCardDragged && !enemysTurn) {
                setSpread(MAX_HAND_CARD_LEFT_SPREAD);
                setSpreadOffset((cards.length * -MAX_HAND_CARD_LEFT_SPREAD) / 2);
            }
        } else {
            setSpread(MIN_HAND_CARD_LEFT_SPREAD);
            const handOffset = getPlayerHandOffset(cards.length);
            setSpreadOffset(handOffset);
        }
    }, [
        activeAnimation,
        shouldSpread,
        handCardDragged,
        enemysTurn,
        MAX_HAND_CARD_LEFT_SPREAD,
        MIN_HAND_CARD_LEFT_SPREAD,
        cards.length,
    ]);

    const [hover, setHover] = useState(false);

    return (
        <Droppable droppableId={droppableId} isDropDisabled={true}>
            {(p) => (
                <div
                    {...p.droppableProps}
                    ref={p.innerRef}
                    // Must be 0 to prevent cards next to dragged card jumping down.
                    style={{ width: 0 }}
                >
                    <div
                        style={{
                            position: "absolute",
                            display: "flex",
                            height: styles.cardHeight,
                            width: "100%",
                        }}
                        ref={(el) => registerPlaceOffset(el, id)}
                    >
                        {cards.map((card, index) =>
                            !animationCardIds.includes(card.id) ? (
                                <div
                                    // This is a container div for one card and two spacers
                                    style={{
                                        height: styles.cardHeight,
                                        position: "relative",
                                        display: "flex",
                                        left: spreadOffset,
                                        transition: "180ms",
                                    }}
                                    onMouseEnter={() => setShouldSpread(true)}
                                    onMouseLeave={() => setShouldSpread(false)}
                                >
                                    <div
                                        // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                                        style={{
                                            width: spread,
                                            transition: "all 180ms",
                                            height: styles.cardHeight,
                                        }}
                                    />
                                    <HandCard
                                        id={card.id}
                                        index={index}
                                        image={card.imageName}
                                        numHandCards={cards.length}
                                        key={card.id}
                                    />

                                    <div
                                        // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                                        style={{
                                            width: spread,
                                            transition: "all 180ms",
                                            height: styles.cardHeight,
                                        }}
                                    />
                                </div>
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
                            )
                        )}
                    </div>
                    {p.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default NewHand;
