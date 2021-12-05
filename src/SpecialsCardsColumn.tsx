import Card from "./Card";

interface SpecialsCardsColumnProps {
  cards: GameCard[];
  dimensions: AllDimensions;
}

export const SpecialsCardsColumn = (props: SpecialsCardsColumnProps) => {
  const { cards, dimensions } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", width: dimensions.cardWidth }}>
      {cards.map(card => (
        <div style={{height: 30}}>
          <Card index={card.index} id={card.id} image={card.image} dimensions={dimensions} key={card.id} />
        </div>
      ))}
    </div>
  );
};
