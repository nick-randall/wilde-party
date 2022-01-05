import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLayout } from "./dimensions/getLayout";
import { getPlacesLayout } from "./dimensions/getPlacesLayout";
import { getAllDimensions } from "./helperFunctions/getDimensions";
import { RootState } from "./redux/store";

interface DeckProps {
  id: string;
  cards: GameCard[];
  zoneSize: {width: number, height: number}
  
}

export const Deck = (props: DeckProps) => {
  const { id, zoneSize } = props;
  const {x,y} = getPlacesLayout(id, zoneSize)
  const dispatch = useDispatch();
  const dimensions = getAllDimensions(id);
  const handleClick = () => {
    console.log("clicked on deck");
    dispatch({ type: "DRAW_CARD", payload: id });
  };

  return(
    <div style={{left: x, top: y, position: "absolute"}}>
    <input type="image" src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }} onClick={handleClick}  />
</div>)
};
