import { Ref, RefObject, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleNewMockRenderData from "../animations/handleNewMockRenderData";
import { RootState } from "../redux/store";

export interface UseMockRenderProps {
  cardId: string;
  ref: Ref<HTMLDivElement>;
}

const useMockRender = (cardId: string, dimensions: AllDimensions, rotateX: number, ref: RefObject<HTMLDivElement>) => {
  const animationTemplates = useSelector((state: RootState) => state.animationTemplates);
  const dispatch = useDispatch();

  useEffect(() => {
    if (animationTemplates.length > 0) {
      animationTemplates[0].forEach(a => {
        if (a.cardId === cardId && a.status === "awaitingScreenData") {
          if (ref !== null && ref?.current !== null) {
            const element = ref.current;
            const { left, top } = element.getBoundingClientRect();
            const mockRenderData = { cardId, dx: left, dy: top, dimensions: { rotateX, ...dimensions } };
            dispatch(handleNewMockRenderData(mockRenderData, "from"));
          }
        }
      });
    }
  }, [animationTemplates, cardId, dimensions, dispatch, ref, rotateX]);
  useEffect(() => {
    if (animationTemplates.length > 0) {
      animationTemplates[0].forEach(a => {
        a.intermediateSteps?.forEach(step => {
          if ("targetId" in step && step.targetId === cardId && a.status === "awaitingScreenData") {
            
            if (ref !== null && ref?.current !== null) {
              const element = ref.current;
              const { left, top } = element.getBoundingClientRect();
              const mockRenderData = { cardId, dx: left, dy: top, dimensions: { rotateX, ...dimensions } };
              dispatch(handleNewMockRenderData(mockRenderData, "intermediate"));
            }
          }
        });
      });
    }
  }, [animationTemplates, cardId, dimensions, dispatch, ref, rotateX]);
};

export default useMockRender;
