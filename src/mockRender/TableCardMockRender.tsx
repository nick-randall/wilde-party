import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import handleNewMockRenderData from "../animations/handleNewMockRenderData";

export interface TableCardMockRenderProps {
  cardId: string;
  index: number;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;

  //cardGroupIndex: number;
}

/**
 * Not for HandCards
 * @param props.image
 * @returns
 */

const TableCardMockRender: React.FC<TableCardMockRenderProps> = ({ cardId, dimensions, offsetLeft, offsetTop }) => {
  const { tableCardzIndex, cardHeight, cardWidth } = dimensions;
  const mockRenderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft,
    top: offsetTop,
    position: "absolute",
  };
  /**
   * Called after the Mock Render component is created, passing its 
   * location and dimensions to the SnapshotChanges object...
   */
  useEffect(() => {
    if (mockRenderRef !== null && mockRenderRef.current !== null) {
      const element = mockRenderRef.current;
      const { left, top } = element.getBoundingClientRect();
      const mockRenderData = { cardId, xPosition: left, yPosition: top, dimensions: { rotateX: 0, ...dimensions } };
      dispatch(handleNewMockRenderData(mockRenderData, "to"));
    }
  }, [dimensions, dispatch, cardId]);

  return (
    <div
      ref={mockRenderRef}
      draggable="false"
      style={{
        ...normalStyles,
      }}
    />
  );
};

export default TableCardMockRender;
