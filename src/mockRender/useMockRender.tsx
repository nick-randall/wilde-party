import { Ref, RefObject, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleNewMockRenderData from "../animations/handleNewMockRenderData";
import { RootState } from "../redux/store";

export interface UseMockRenderProps {
  cardId: string;
  ref: Ref<HTMLDivElement>;
}

const useMockRender = (cardId: string, dimensions: AllDimensions, rotation: number, ref: RefObject<HTMLDivElement>) => {
  const animationTemplates = useSelector((state: RootState) => state.animationTemplates);
  const dispatch = useDispatch();

  useEffect(() => {
    if (animationTemplates.length > 0) {
      animationTemplates[0].forEach(a => {
        if (a.from.cardId === cardId && a.status === "awaitingEmissaryData") {
          if (ref !== null && ref?.current !== null) {
            const element = ref.current;
            const { left, top } = element.getBoundingClientRect();
            console.log("mockRenderProps cardId: " + cardId);
            dispatch(handleNewMockRenderData({ cardId, xPosition: left, yPosition: top, rotation, dimensions }, "from"));
          }
        }
      });
    }
  }, [animationTemplates, cardId, dimensions, dispatch, ref, rotation]);
};

export default useMockRender;
