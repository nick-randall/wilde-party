import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";
import {
    getCardGroupsObjs,
    getCardRowShapeOnDraggedOver,
    getCardRowShapeOnRearrange,
    NewCardGroupObj,
} from "../helperFunctions/groupGCZCards";
import { Droppable } from "react-beautiful-dnd";
import NewCardGroup from "./NewCardGroup";
import { getEnchantableNeighbours } from "../helperFunctions/canEnchantNeighbour";

interface NewGCZProps {
    id: number;
    GCZCards: GameCard[];
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

export const testCardRow = () => {
    const row: GameCard[] = [
        {
            id: 1,
            cardType: "guest",
            name: "guest1",
            imageName: "guest1",
            guestCardType: "rumgroelerin",
            pointValue: 1,
            action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
        },

        {
            id: 1,
            cardType: "bff",
            name: "bff1",
            imageName: "bff1",
            pointValue: 1,
            action: { actionType: "destroy", highlightType: "card", targetPlayerType: "enemy" },
        },
    ];
    const cardRow = getCardGroupsObjs(row);
};

const NewGCZ: React.FC<NewGCZProps> = ({ id, GCZCards, player, registerPlaceOffset }) => {
    const { draggedOver, rearrangingData, draggedHandCard, highlights } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const { cardWidth, cardHeight } = getCardStyleValuesFromPlaceAndPlayer(
        "guestCardZone",
        player,
        currSnapshot
    );
    // console.log(GCZCards);
    const droppableId = JSON.stringify({ type: "place", id });

    const ghostCardIndex = draggedOver?.id === id ? draggedOver.index : rearrangingData.sourceIndex;
    const ghostCard = draggedHandCard && ghostCardIndex !== -1 ? draggedHandCard : undefined;

    const cardRow: NewCardGroupObj[] = getCardGroupsObjs(GCZCards);
    const cardRowShape =
        rearrangingData.placeId === id
            ? getCardRowShapeOnRearrange(cardRow, rearrangingData.sourceIndex)
            : getCardRowShapeOnDraggedOver(cardRow);

    const ghostCardGroup = cardRow.find((e) => rearrangingData.draggedId === e.id);
    const isHighlighted = highlights.includes(id);

    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    const allowDropping = isHighlighted || rearranging; // || containsTargetedCard; // better name!°

    return (
        <div ref={(el) => registerPlaceOffset(el, id)}>
            <Droppable
                droppableId={droppableId}
                direction="horizontal"
                isDropDisabled={!allowDropping}
            >
                {(provided) => (
                    <div
                        className={`pl0GCZ ${isHighlighted ? "highlighted" : ""}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            margin: 0,
                            border: "1px solid black",
                            // height: enchantmentsRowCards.length === 0 ? cardHeight : cardHeight * 1.5,
                            minHeight: cardHeight,
                            minWidth: cardWidth,
                        }}
                    >
                        {cardRow.map((cardGroup, index) => (
                            <NewCardGroup
                                cardGroup={cardGroup}
                                cardGroupIndex={index}
                                physicalIndex={cardRowShape[index]}
                                enchantableNeighbours={getEnchantableNeighbours(cardRow, index)}
                                key={cardGroup.id}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default NewGCZ;
