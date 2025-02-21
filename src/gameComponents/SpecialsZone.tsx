import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import GhostCard from "./GhostCard";
import { RootState } from "../redux/store";
import { SpecialsCardsColumn } from "./SpecialsCardsColumn";
import "../css/global.css";
import { getCardStyleValuesFromPlaceAndPlayer } from "../helperFunctions/getCardStyles";

interface SpecialsZoneProps {
    id: number;
    gameSnapshot: GameSnapshot;
    alignment: string;
    player: number;
    registerPlaceOffset: (el: HTMLElement | null, id: number) => void;
}

type SpecialsColumnCards = {
    cardType: GuestCardType;
    cards: GameCard[];
    startingIndex: number;
};

const groupSpecialsColumns = (specialsCards: GameCard[]): SpecialsColumnCards[] => {
    const allSpecialsCardsTypes: GuestCardType[] = [
        "rumgroelerin",
        "saufnase",
        "schleckermaul",
        "taenzerin",
    ];
    let startingIndex = 0;
    return allSpecialsCardsTypes.map((cardType) => {
        const cards = specialsCards.filter((card) => card.guestCardType === cardType);
        const column = {
            cards,
            startingIndex,
            cardType,
        };
        startingIndex += cards.length;
        return column;
    });
};

export const SpecialsZone: React.FC<SpecialsZoneProps> = ({
    id,
    gameSnapshot,
    alignment,
    player,
    registerPlaceOffset,
}) => {
    const cards = gameSnapshot.players[player].places.specialsZone.cards;
    const myIndex = useSelector((state: RootState)=> state.userGameState.myIndex);
    const droppableData: DroppableData = {
        type: "place",
        id,
        placeType: "specialsZone",
        player: myIndex,
    };
    const droppableId = JSON.stringify(droppableData);
    const { currSnapshot } = useSelector((state: RootState) => state.gameSnapshotState);
    const styles = getCardStyleValuesFromPlaceAndPlayer("specialsZone", player, currSnapshot);
    const { cardWidth, cardHeight } = styles;
    const { draggedOver, draggedHandCard } = useSelector(
        (state: RootState) => state.dragEventState
    );
    const isHighlighted = useSelector((state: RootState) =>
        state.dragEventState.highlights.includes(id)
    );
    const rearranging = useSelector(
        (state: RootState) => state.dragEventState.rearrangingData.placeId === id
    );
    const specialsCardsColumns = groupSpecialsColumns(cards); // R.groupWith<GameCard>((a, b) => a.specialsCardType === b.specialsCardType, specialsCards);
    const draggedSpecialsType = draggedHandCard?.specialsCardType;
    const allowDropping =
        isHighlighted &&
        specialsCardsColumns.some(
            (column) => column.cardType === draggedSpecialsType && column.cards.length === 0
        );

    const ghostCard =
        draggedOver?.id === id && draggedOver.index !== -1 ? draggedHandCard : undefined;

    // const allowDropping = rearranging;

    return (
        <Droppable droppableId={droppableId} direction="horizontal" isDropDisabled={!allowDropping}>
            {(provided) => (
                <div ref={(el) => registerPlaceOffset(el, id)}>
                    <div
                        className={`grid-item ${alignment} ${isHighlighted ? "highlighted" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            display: "flex",
                            margin: 0,
                            width: specialsCardsColumns.length * cardWidth,
                            minWidth: cardWidth,
                            height: cardHeight,
                            transition: "left 250ms",
                        }}
                    >
                        {specialsCardsColumns.map((column, index) =>
                            column.cards.length === 0 ? null : (
                                <SpecialsCardsColumn
                                    cardStyles={styles}
                                    cards={column.cards}
                                    cardType={column.cardType}
                                    columnIndex={index}
                                    startingIndex={column.startingIndex}
                                    key={column.cards[0].id + index}
                                    specialsZoneId={id}
                                />
                            )
                        )}
                        {ghostCard ? (
                            <GhostCard
                                cardId={ghostCard.id}
                                index={draggedOver?.index ?? 0}
                                imageName={ghostCard.imageName}
                                zIndex={9}
                            />
                        ) : null}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};
