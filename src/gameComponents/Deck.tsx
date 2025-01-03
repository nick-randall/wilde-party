import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { RootState } from "../redux/store";
import { drawCardThunk } from "../redux/thunks";
import "../css/grid.css";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import { FC, forwardRef } from "react";
import { RefMap } from "../animations/animationHelperFunctions";
import AnimatedCard from "./AnimatedCard";

interface DeckProps {
    id: number;
    cards: GameCard[];
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
    // zoneSize: { width: number; height: number };
}

export const Deck: FC<DeckProps> = (props) => {
    const { id, cards, registerPlaceOffset } = props;
    const dispatch = useDispatch();
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const dimensions = getCardStyleValuesFromPlaceAndPlayer("deck", null, currSnapshot);
    const { player, draws, phase } = useSelector(
        (state: RootState) => state.gameSnapshotState.currSnapshot.current
    );
    const canDraw = player === 0 && phase === "drawPhase" && draws > 0 && cards.length > 0;
    const handleClick = () => {
        if (canDraw) dispatch(drawCardThunk(0));
    };

    const { activeAnimation, newSnapshot } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );
    const useOldSnapshot = activeAnimation?.showPrevSnapshot.includes(id) ?? true;
    const gameSnapshot = useOldSnapshot ? currSnapshot : newSnapshot!;
    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const deckCards = gameSnapshot.nonPlayerPlaces.deck.cards;

    // const cardsInReverseOrder = Array.from(cards).reverse();
    const cardsInReverseOrder = Array.from(deckCards).reverse();

    const highlightStyles = canDraw
        ? {
              backgroundColor: "yellowgreen",
              boxShadow: "0px 0px 30px 30px yellowgreen",
              transition: "background-color 180ms, box-shadow 180ms, left 180ms",
          }
        : {};

    return (
        <div
            ref={(el) => registerPlaceOffset(el, id)}
            style={{
                height: dimensions.cardHeight,
                width: dimensions.cardWidth,
                position: "absolute",
                ...highlightStyles,
            }}
            onClick={handleClick}
        >
            {cardsInReverseOrder.map((card, index) =>
                !animationCardIds.includes(card.id) ? (
                    <Card key={card.id} id={card.id} index={index} imageName="back" />
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
    );
};
