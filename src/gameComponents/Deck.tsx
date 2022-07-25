import { connect, useDispatch, useSelector } from "react-redux";
import { getDimensions } from "../helperFunctions/getDimensions";
import MockRenderProvider from "../mockRender/MockRenderProvider";
import TableCardMockRender from "../mockRender/TableCardMockRender";
import { RootState } from "../redux/store";
import Card from "./Card";

interface DeckProps {
  id: string;
  cards: GameCard[];
}

const Deck = (props: DeckProps) => {
  const { id, cards } = props;
  const dispatch = useDispatch();
  const dimensions = getDimensions(null, "deck");
  const { player, draws, phase } = useSelector((state: RootState) => state.gameSnapshot.current);
  const canDraw = player === 0 && phase === "drawPhase" && draws > 0 && cards.length > 0;
  const handleClick = () => {
    // if (canDraw) dispatch(drawCardThunk(0));
  };

  // const cardsInReverseOrder = Array.from(cards).reverse();

  const highlightStyles = canDraw
    ? {
        backgroundColor: "yellowgreen",
        boxShadow: "0px 0px 30px 30px yellowgreen",
        transition: "background-color 180ms, box-shadow 180ms, left 180ms",
      }
    : {};

  return (
    <MockRenderProvider player={null} placeType={"deck"} placeId={id}>
      {(cards, mockRenderIds) => (
        <div
          style={{
            //left: x, top: y, height: dimensions.cardHeight, width: dimensions.cardWidth, position: "absolute",
            height: dimensions.cardHeight,
            ...highlightStyles,
          }}
          onClick={handleClick}
        >
          {Array.from(cards)
            .reverse()
            .map((card, index) =>
              mockRenderIds.includes(card.id) ? (
                <TableCardMockRender dimensions={dimensions} cardId={card.id} index={index} />
              ) : (
                <Card dimensions={dimensions} id={card.id} index={index} image="back" placeId={id} placeType="deck"/>
              )
            )}
        </div>
      )}
    </MockRenderProvider>
  );
};
export default Deck;
