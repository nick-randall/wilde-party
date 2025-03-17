import { useSelector } from "react-redux";
import { dimensionConstants, getCardStyleValues } from "../helperFunctions/getCardStyles";
import { RootState } from "../redux/store";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";

export interface GhostCardGroupProps {
    physicalIndex: number;
    ghostCardGroup: NewCardGroupObj;
}

const GhostCardGroup = (props: GhostCardGroupProps) => {
    const { ghostCardGroup, physicalIndex } = props;
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardHeight, cardWidth } = getCardStyleValues(ghostCardGroup.id, currSnapshot);
    console.log("ghost card group physicalIndex: ", physicalIndex);

    if (ghostCardGroup.cards.length === 1)
        return (
            <img
                src={`./images/${ghostCardGroup.cards[0].imageName}.jpg`}
                alt={ghostCardGroup.cards[0].imageName}
                style={{
                    left: cardWidth * physicalIndex,
                    position: "absolute",
                    height: cardHeight,
                    width: cardWidth,
                    top: 0,
                    zIndex: 99,
                    borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                    WebkitFilter: "grayscale(100%)",
                    opacity: 0.7,
                }}
            />
        );
    if (ghostCardGroup.cards.length === 2)
        return <ZwillingGhostCardGroup cardGroup={ghostCardGroup} physicalIndex={physicalIndex} />;
    else return <BFFCardGroup cardGroup={ghostCardGroup} physicalIndex={physicalIndex} />;
};

interface BFFOrZwillingGhostCardGroup {
    cardGroup: CardGroupObj;
    physicalIndex: number;
}

const ZwillingGhostCardGroup: React.FC<BFFOrZwillingGhostCardGroup> = ({
    cardGroup,
    physicalIndex,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardStyleValues(cardGroup.id, currSnapshot);
    return (
        <div style={{ position: "absolute", left: cardWidth * physicalIndex, top: 0 }}>
            <div
                style={{
                    // height: cardHeight * 1.5,
                    // width: cardWidth,
                    // left,
                    position: "relative",
                }}
            >
                <img
                    src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                    alt={cardGroup.cards[0].imageName}
                    style={{
                        position: "absolute",
                        height: cardHeight,
                        width: cardWidth,
                        left: 0,
                        top: 0,
                        zIndex: 99,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        WebkitFilter: "grayscale(100%)",
                        opacity: 0.7,
                    }}
                />
                <img
                    src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                    alt={cardGroup.cards[1].imageName}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: cardHeight / 2,
                        height: cardHeight,
                        width: cardWidth,
                        zIndex: 99,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        WebkitFilter: "grayscale(100%)",
                        opacity: 0.7,
                    }}
                />
            </div>
        </div>
    );
};

const BFFCardGroup: React.FC<BFFOrZwillingGhostCardGroup> = ({ cardGroup, physicalIndex }) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardWidth, cardHeight } = getCardStyleValues(
        cardGroup.id,
        currSnapshot
    );
    return (
        <div style={{ position: "absolute", left: cardWidth * physicalIndex, top: 0 }}>
            <div
                style={{
                    position: "relative",
                }}
            >
                <img
                    src={`./images/${cardGroup.cards[0].imageName}.jpg`}
                    alt={cardGroup.cards[0].imageName}
                    style={{
                        position: "absolute",
                        height: cardHeight,
                        width: cardWidth,
                        left: 0,
                        top: 0,
                        zIndex: 99,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        WebkitFilter: "grayscale(100%)",
                        opacity: 0.7,
                    }}
                />

                <img
                    src={`./images/${cardGroup.cards[1].imageName}.jpg`}
                    alt={cardGroup.cards[1].imageName}
                    style={{
                        position: "absolute",
                        left: cardWidth / 2,
                        top: cardHeight / 2,
                        height: cardHeight,
                        width: cardWidth,
                        zIndex: 99,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        WebkitFilter: "grayscale(100%)",
                        opacity: 0.7,
                    }}
                />
                <img
                    src={`./images/${cardGroup.cards[2].imageName}.jpg`}
                    alt={cardGroup.cards[2].imageName}
                    style={{
                        position: "absolute",
                        left: cardWidth,
                        top: 0,
                        height: cardHeight,
                        width: cardWidth,
                        zIndex: 99,
                        borderRadius: dimensionConstants.CARD_BORDER_RADIUS,
                        WebkitFilter: "grayscale(100%)",
                        opacity: 0.7,
                    }}
                />
            </div>
        </div>
    );
};
export default GhostCardGroup;
