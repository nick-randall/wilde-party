import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EnemyHandCard from "./EnemyHandCard";
import {
    dimensionConstants,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import AnimatedCard from "./AnimatedCard";
interface EnemyHandProps {
    id: number;
    gameSnapshot: GameSnapshot;
    player: number;
    // currAnimations: AnimationData[]
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const EnemyHand = (props: EnemyHandProps) => {
    const { id, player, gameSnapshot, registerPlaceOffset } = props;
    const { activeAnimation } = useSelector((state: RootState) => state.gameSnapshotState);

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);
    const styles = getCardStyleValuesFromPlaceAndPlayer("hand", player, gameSnapshot);
    const maxCardLeftSpread = dimensionConstants.MAX_HAND_CARD_LEFT_SPREAD;
    const handCardDragged = useSelector((state: RootState) => state.dragEventState.draggedHandCard);
    const transitionsUnderway = useSelector(
        (state: RootState) => state.dragEventState.transitionData.length > 0
    );
    const spread = styles.left;

    const cards = gameSnapshot.players[player].places.hand.cards;

    return (
        <div
            style={{
                position: "relative",
                // display: "flex",
                // This causes whole card row to move left on spread
                //left: x - (spread / 2) * handCards.length,
                transition: "180ms",
                height: styles.cardHeight,
            }}
            ref={(el) => registerPlaceOffset(el, id)}
        >
            {cards.map((card, index) =>
                !animationCardIds.includes(card.id) ? (
                    <EnemyHandCard
                        id={card.id}
                        index={index}
                        imageName={card.imageName}
                        key={card.id}
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
            <p style={{fontSize: 40}}>{id}</p>
        </div>
    );
};

export default EnemyHand;
