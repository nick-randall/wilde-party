import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { RootState } from "../redux/store";
import { drawCardThunk } from "../redux/thunks";
import "../css/grid.css";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import { FC } from "react";
import AnimatedCard from "./AnimatedCard";
import { getUserPhase } from "../gameSnapshotState/gameSnapshotSelectors";

interface DeckProps {
    id: number;
    gameSnapshot: GameSnapshot;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
    // zoneSize: { width: number; height: number };
}

export const Deck: FC<DeckProps> = (props) => {
    const { id, gameSnapshot, registerPlaceOffset } = props;

    const { player, draws } = gameSnapshot.current /// ???
    const phase = useSelector(getUserPhase)
    const handleClick = () => {
        if (canDraw) dispatch(drawCardThunk(0));
    };
    const dispatch = useDispatch();
    const dimensions = getCardStyleValuesFromPlaceAndPlayer("deck", null, gameSnapshot);

    const { activeAnimation } = useSelector((state: RootState) => state.animationState);
    const cards = gameSnapshot.nonPlayerPlaces.deck.cards;
    const canDraw = player === 0 && phase === "drawing" && draws > 0 && cards.length > 0;

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
