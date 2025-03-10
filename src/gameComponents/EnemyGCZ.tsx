import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardGroupStyles,
    getCardStyleValuesFromPlaceAndPlayer,
} from "../helperFunctions/getCardStyles";
import Card from "./Card";
import { RootState } from "../redux/store";
import AnimatedCard from "./AnimatedCard";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import NewCardGroup from "./NewCardGroup";

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
    const { id, gameSnapshot, alignment, player, registerPlaceOffset } = props;
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;

    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);

    const cardRowShape = getCardRowShapeOnDraggedOver(cardRow);
    cardRowShape.unshift(0);

    const styles = getCardStyleValuesFromPlaceAndPlayer("guestCardZone", player, gameSnapshot);
    return (
        <div className={`grid-item ${alignment}`} ref={(el) => registerPlaceOffset(el, id)} style={{ position: "relative" }}>
            {cardRow.map((card, index) =>
                !animationCardIds.includes(card.id) ? (
                    <EnemyCardGroup
                        key={card.id}
                        cardGroup={cardRow[index]}
                        physicalIndex={index}
                    />
                ) : (
                    <AnimatedCard
                        key={card.id}
                        id={card.id}
                        currAnimations={animations.filter(
                            (a) => a.cardId === card.id && a.placeId === id
                        )}
                        imageName={card.cards[0].imageName}
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

interface EnemyCardGroupProps {
    cardGroup: CardGroupObj;
    physicalIndex: number;
}

const EnemyCardGroup = (props: EnemyCardGroupProps) => {
    const { cardGroup, physicalIndex } = props;
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardGroupStyles(
        cardGroup,
        physicalIndex,
        currSnapshot
    );
    if (cardGroup.cards.length === 1) {
        return (
            <img
                src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                alt={cardGroup.cards[0].imageName}
                style={{
                    position: "absolute",
                    left: cardWidth * physicalIndex,
                    width: cardWidth * cardGroup.size,
                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                }}
            />
        );
    }
    if (cardGroup.cards.length === 2) {
        return (
            <div
                style={{
                    position: "relative",
                    left: cardWidth * physicalIndex,
                    width: cardWidth * cardGroup.size,
                }}
            >
                <img
                    src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                    alt={cardGroup.cards[0].imageName}
                    style={{
                        position: "absolute",
                        height: cardHeight,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                    }}
                />
                <img
                    src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                    alt={cardGroup.cards[1].imageName}
                    style={{
                        position: "absolute",
                        height: cardHeight,
                        top: cardHeight / 2,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                    }}
                />
            </div>
        );
    }
    return (
        <div>
            <img
                src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                alt={cardGroup.cards[0].imageName}
                style={{
                    position: "absolute",
                    height: cardHeight,
                    width: cardWidth,
                    left: 0,
                    top: cardHeight / 2,
                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                }}
            />
            <img
                src={`./images/${cardGroup.cards[2].imageName}.jpg`}
                alt={cardGroup.cards[2].imageName}
                style={{
                    position: "absolute",
                    left: cardWidth,
                    top: cardWidth / 2,
                    height: cardHeight,
                    width: cardWidth,
                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                }}
            />
            <img
                src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                alt={cardGroup.cards[1].imageName}
                style={{
                    position: "absolute",
                    left: cardWidth / 2,
                    top: 0,
                    height: cardHeight,
                    width: cardWidth,
                    zIndex: 99,
                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                }}
            />
        </div>
    );
};
