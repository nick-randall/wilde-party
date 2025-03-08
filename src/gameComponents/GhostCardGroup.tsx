import { useSelector } from "react-redux";
import {
    dimensionConstants,
    getCardGroupStyles,
    getCardStyles,
    getCardStyleValues,
} from "../helperFunctions/getCardStyles";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import { NewCardGroupObj } from "../helperFunctions/groupGCZCards";

export interface GhostCardGroupProps {
    index: number;
    ghostCardGroup: NewCardGroupObj;
}

const GhostCardGroup = (props: GhostCardGroupProps) => {
    const { ghostCardGroup, index } = props;
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardHeight, cardWidth, left } = getCardStyleValues(ghostCardGroup.id, currSnapshot);
    console.log("ghost card group index: ", index);

    if (ghostCardGroup.cards.length === 2)
        return (
            <ZwillingGhostCardGroup
                cardGroup={ghostCardGroup}
                cardGroupIndex={index}
                //  physicalIndex={physicalIndex}
            />
        );

    return (
        <img
            src={`./images/${ghostCardGroup.cards[0].imageName}.jpg`}
            alt={ghostCardGroup.cards[0].imageName}
            style={{
                left: cardWidth * index,
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
};

interface BFFOrZwillingGhostCardGroup {
    cardGroup: CardGroupObj;
    //  physicalIndex: number;
    cardGroupIndex: number;
}

const ZwillingGhostCardGroup: React.FC<BFFOrZwillingGhostCardGroup> = ({
    cardGroup,
    //  physicalIndex,
    cardGroupIndex,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardStyleValues(
        cardGroup.id,
        //  physicalIndex,
        currSnapshot
    );
    return (
        <div style={{ position: "absolute", left: cardWidth * cardGroupIndex, top: 0 }}>
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

const BFFCardGroup: React.FC<BFFOrZwillingGhostCardGroup> = ({
    cardGroup,
    //  physicalIndex,
    //  cardGroupIndex,
}) => {
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { left, cardWidth, cardHeight } = getCardStyleValues(
        cardGroup.id,
        //  physicalIndex,
        currSnapshot
    );
    return (
        <div
            style={{
                height: cardHeight * 1.5,
                width: cardWidth,
                left,
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
                    top: cardHeight / 2,
                    zIndex: 99,
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
                    zIndex: 99,
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
export default GhostCardGroup;
