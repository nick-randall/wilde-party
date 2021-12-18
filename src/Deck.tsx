import React from "react";
import { useDispatch } from "react-redux";
import { getAllDimensions } from "./helperFunctions/getDimensions";

interface DeckProps {
  id: string;
  cards: GameCard[];
}

export const Deck = (props: DeckProps) => {
  const { id } = props;
  const dispatch = useDispatch();
  const dimensions = getAllDimensions(id);
  const handleClick = (e: React.MouseEvent) => {
    console.log("clicked on deck");
    dispatch({ type: "DRAW_CARD", payload: id });
  };

  return(
  <button onMouseOver={handleClick}>
    <img src="./images/back.jpg" alt="deck" style={{ height: dimensions.cardHeight }}  />
  </button>)
};
