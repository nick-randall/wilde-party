import { useSelector } from "react-redux";
import { dimensionConstants, getCardGroupStyles } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import {
    getCardGroupsObjs,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import AnimatedCardGroup from "./AnimatedCardGroup";

interface EnemyGCZProps {
    player: number;
    id: number;
    gameSnapshot: GameSnapshot;
    alignment: string;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

const EnemyGCZ = (props: EnemyGCZProps) => {
    const { id, gameSnapshot, player, registerPlaceOffset } = props;
    const { activeAnimation } = useSelector((state: RootState) => state.animationState);

    const animations = activeAnimation?.animations ?? [];
    const animationCardIds = animations.map((a) => a.cardId);

    const GCZCards = gameSnapshot.players[player].places.guestCardZone.cards;

    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);

    return (
        <div ref={(el) => registerPlaceOffset(el, id)} style={{ position: "relative" }}>
            {cardRow.map((cardGroup, index) => {
                const animated: { [key: number]: boolean } = {};
                cardGroup.cards.forEach((c) => {
                    animated[c.id] = animationCardIds.includes(c.id);
                });
                const allAreAnimated = Object.values(animated).every((a) => a);
                const noneAreAnimated = Object.values(animated).every((a) => !a);
                if (!allAreAnimated && !noneAreAnimated) {
                    throw new Error("Some cards in CardGroup are animated and some are not!!!");
                }
                return !animationCardIds.includes(cardGroup.id) ? (
                    <EnemyCardGroup
                        key={cardGroup.id}
                        cardGroup={cardRow[index]}
                        physicalIndex={index}
                    />
                ) : (
                    <AnimatedCardGroup
                        key={cardRow[index].id}
                        cardGroup={cardRow[index]}
                        currAnimations={animations.filter(
                            (a) =>
                                cardGroup.cards.map((c) => c.id).includes(a.cardId) &&
                                a.placeId === id
                        )}
                        gameSnapshot={gameSnapshot}
                    />
                );
            })}
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
    const { cardWidth, cardHeight } = getCardGroupStyles(cardGroup, physicalIndex, currSnapshot);
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
