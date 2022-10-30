import  { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import handleNewMockRenderData from "../animations/handleNewMockRenderData";
import { rotateHandCard } from "../helperFunctions/getDimensions";

export interface HandCardMockRenderProps {
  cardId: string;
  index: number;
  dimensions: AllDimensions;
  numHandCards: number;
  spread: number;
}
/**
 * A Mock Render Card is rendered invisibly by its parent component.
 * Its purpose is to use the rendering engine to determine where an
 * object (usually a Card) will be rendered. As soon as it is invisibly
 * rendered, it sends its location back to Redux, providing the coordinates
 * needed for building a transition (following a rebuild by React).
 * @param props
 * @returns
 */
const HandCardMockRender: React.FC<HandCardMockRenderProps> = ({ cardId, index, dimensions, spread, numHandCards }) => {
  // const { id, animationTemplateId, index, dimensions, spread, numHandCards } = props;
  const { cardWidth, cardHeight } = dimensions;
  const mockRenderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    width: cardWidth,
    height: cardHeight,
    // top: index * cardTopSpread,
    left: spread * index - (spread * numHandCards) / 2,
    position: "absolute",
    // transform: `rotate(${rotation(index)}deg)`,
    // backgroundColor: "black"
  };

  /**
   * Called after the MockRender is created, passing its location to
   * the SnapshotChanges object...
   */
  useEffect(() => {
    if (mockRenderRef !== null && mockRenderRef.current !== null) {
      const element = mockRenderRef.current;
      const { left, top } = element.getBoundingClientRect();
      dispatch(
        handleNewMockRenderData(
          { cardId, xPosition: left, yPosition: top, dimensions, rotation: rotateHandCard(index, numHandCards) },
          "to"
        )
      );
    }
  }, [cardId, dimensions, dispatch, index, numHandCards]);

  return  (
    <div
      ref={mockRenderRef}
      id={cardId}
      style={{
        ...normalStyles,
      }}
    />)
  
};
export default HandCardMockRender;
