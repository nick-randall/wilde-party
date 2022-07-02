import { CSSProperties, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import handleNewMockRenderData from "../animations/handleNewMockRenderData";

export interface TableCardMockRenderProps {
  cardId: string;
  index: number;
  image: string;
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

const TableCardMockRender: React.FC<TableCardMockRenderProps> = ({ cardId, image, dimensions, offsetLeft, offsetTop }) => {
  const { tableCardzIndex, cardHeight, cardWidth } = dimensions;
  const emissaryRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    left: offsetLeft,
    top: offsetTop,
    position: "absolute",
    // backgroundColor: "black"
  };
  /**
   * Called after the Emissary is created, passing its location to
   * the SnapshotChanges object...
   */
  useEffect(() => {
    if (emissaryRef !== null && emissaryRef.current !== null) {
      const element = emissaryRef.current;
      const { left, top } = element.getBoundingClientRect();
      console.log("TableCardEmissary dispatch ----left:" + left, " ---top: " + top);
      dispatch(handleNewMockRenderData({ cardId, xPosition: left, yPosition: top, dimensions, rotation: 0 }, "to"));
    }
  }, [dimensions, dispatch, cardId]);

  return (
    <div
      ref={emissaryRef}
      draggable="false"
      style={{
        ...normalStyles,
      }}
    />
  );
};

export default TableCardMockRender;
