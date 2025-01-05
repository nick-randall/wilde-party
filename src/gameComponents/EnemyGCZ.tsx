import { useSelector } from "react-redux";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import Card from "./Card";
import { RootState } from "../redux/store";
import AnimatedCard from "./AnimatedCard";

interface EnemyGCZProps {
    player: number;
    id: number;
    gameSnapshot: GameSnapshot;
    // GCZCards: GameCard[];
    // currAnimations: AnimationData[];
    alignment: string;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const EnemyGCZ = (props: EnemyGCZProps) => {
    const { id, gameSnapshot , alignment, player, registerPlaceOffset } = props;
    const {  activeAnimation } = useSelector(
        (state: RootState) => state.gameSnapshotState
    );

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;

    const styles = getCardStyleValuesFromPlaceAndPlayer("guestCardZone", player, gameSnapshot);
    return (
        <div className={`grid-item ${alignment}`} ref={(el) => registerPlaceOffset(el, id)}>
            {GCZCards.map((card, index) =>
                !animationCardIds.includes(card.id) ? (
                    <div key={card.id} style={{ left: index * styles.left, position: "relative" }}>
                        <Card id={card.id} index={index} imageName={card.imageName} />
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
            {/* <div style={{ top: styles.cardHeight / 2, position: "absolute" }}>
        {enchantmentsRowCards.map(card => (
          <div key={card.id} style={{ left: card.index * styles.left, position: "absolute" }}>
            <Card id={card.id} index={card.index} imageName={card.imageName} />
          </div>
        ))}
      </div> */}
        </div>
    );
};

export default EnemyGCZ;
