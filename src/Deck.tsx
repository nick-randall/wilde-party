import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLayout } from "./dimensions/getLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface DeckProps {
  id: string;
  cards: GameCard[];
}

export const Deck = (props: DeckProps) => {
  const { id } = props;
  const screenSize = useSelector((state:RootState)=> state.screenSize)
  const {x,y} = getLayout(id, screenSize)
  const dispatch = useDispatch();
  const dimensions = getAllDimensions(id);
  const handleClick = (e: React.MouseEvent) => {
    console.log("clicked on deck");
    dispatch({ type: "DRAW_CARD", payload: id });
  };

  return(
    <div style={{left: x, top: y, position: "absolute"}}>
    <input type="image" src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }} onClick={handleClick}  />
</div>)
};
