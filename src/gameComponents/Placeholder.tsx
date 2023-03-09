import { FC } from "react";

interface PlaceHolderProps {
  dimensions: CardDimensions;
}

const PlaceHolder: FC<PlaceHolderProps> = ({ dimensions }) => {
  return <div style={{ height: dimensions.cardHeight, width: dimensions.cardWidth }} />;
};

export default PlaceHolder;
