import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import { NewHandCard } from "./NewHandCard";
import AnimatedCard from "./AnimatedCard";
import ExperimentHandCard from "./ExperimentHandCard";

interface NewHandProps {
    id: number;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}
const NewHand: React.FC<NewHandProps> = ({ id, player, registerPlaceOffset }) => {
    const [shouldSpread, setShouldSpread] = useState(false);
    const { currSnapshot, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );

    // useEffect(() => {
    //   if (shouldSpread) {
    //     if (!transitionsUnderway && !handCardDragged && !enemysTurn) setSpread(maxCardLeftSpread);
    //   } else {
    //     setSpread(cardLeftSpread);
    //   }
    // }, [transitionsUnderway, shouldSpread, handCardDragged, maxCardLeftSpread, cardLeftSpread, enemysTurn]);
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const maxCardLeftSpread = dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD;
    const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);

    const enemysTurn = useSelector(
        (state: RootState) => state.gameSnapshotState.currSnapshot.current.player !== player
    );
    const myIndex = useSelector((state: RootState) => state.userGameState.myIndex);

    const droppableData: DroppableData = { type: "place", id, placeType: "hand", player: myIndex };
    const droppableId = JSON.stringify(droppableData);

    const useOldSnapshot = activeAnimation?.showPrevSnapshot.includes(id) ?? true;
    const gameSnapshot = useOldSnapshot ? currSnapshot : newSnapshot!;
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const styles = getCardStyleValuesFromPlaceAndPlayer("hand", player, currSnapshot);
    const { left: cardLeftSpread } = styles;
    const [spread, setSpread] = useState(cardLeftSpread);
    const cards = gameSnapshot.players[player].places.hand.cards;

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
                                        left: shouldSpread
                                            ? (cards.length *
                                                  -dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD) /
                                              2
                                            : 0,
                                        //   (cards.length *
                                        //     dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD) /
                                        // 2
                                        transition: "180ms",
                                    }}
                                    onMouseEnter={() => setShouldSpread(true)}
                                    onMouseLeave={() => setShouldSpread(false)}
                                >
                                    <div
                                        // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                                        style={{
                                            width: shouldSpread
                                                ? dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD
                                                : dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD,
                                            transition: "all 180ms",
                                            height: styles.cardHeight,
                                            // border:"thin red solid",
                                            // zIndex: 100
                                        }}
                                    />
                                    <ExperimentHandCard
                                        id={card.id}
                                        index={index}
                                        image={card.imageName}
                                        numHandCards={cards.length}
                                        key={card.id}
                                        // onEnter={() => setShouldSpread(true)}
                                        // onLeave={() => setShouldSpread(false)}
                                    />

                                    <div
                                        // This is a card spacer div, responsible for growing and pushing the hand cards apart.
                                        style={{
                                            width: shouldSpread
                                                ? dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD
                                                : dimensionConstants.MIN_HAND_CARD_LEFT_SPREAD,
                                            transition: "all 180ms",
                                            height: styles.cardHeight,
                                            // border:"thin red solid",
                                            // zIndex: 100
                                        }}
                                    />
                                </div>
                            ) : (
                                // <NewHandCard
                                //     key={card.id}
                                //     id={card.id}
                                //     imageName={card.imageName}
                                //     index={index}
                                //     hover={hover}
                                //     setHover={setHover}
                                //     numHandCards={cards.length}
                                // />
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
