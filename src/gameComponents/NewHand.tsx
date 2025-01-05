import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import { NewHandCard } from "./NewHandCard";
import AnimatedCard from "./AnimatedCard";

interface NewHandProps {
    id: number;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}
const NewHand: React.FC<NewHandProps> = ({ id, player, registerPlaceOffset }) => {
    const [shouldSpread, setShouldSpread] = useState(false);
    const { activeAnimation, currSnapshot, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );

    const maxCardLeftSpread = dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD;
    const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);
    const transitionsUnderway = useSelector(
        (state: RootState) => state.dragEventState.transitionData.length > 0
    );
    const enemysTurn = useSelector(
        (state: RootState) => state.gameSnapshotState.currSnapshot.current.player !== player
    );
    const droppableId = JSON.stringify({ type: "place", id });

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
                <div {...p.droppableProps} ref={p.innerRef}>
                    <div style={{ position: "relative" }} ref={(el) => registerPlaceOffset(el, id)}>
                        {cards.map((card, index) =>
                            !animationCardIds.includes(card.id) ? (
                                <NewHandCard
                                    key={card.id}
                                    id={card.id}
                                    imageName={card.imageName}
                                    index={index}
                                    hover={hover}
                                    setHover={setHover}
                                    numHandCards={cards.length}
                                />
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
