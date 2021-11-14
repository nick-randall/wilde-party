import { Transition } from "react-transition-group";
interface GhostCardProps {
  index: number;
  //left: string;
  //card: GameCard;
  image: string;
  offsetLeft?: number;
  offsetTop?: number;
  dimensions: CardDimensions;
  rotation?: number;
}

export const GhostCard = (props: GhostCardProps) => {
  const { dimensions, rotation, image, index, offsetLeft, offsetTop } = props;
  const {cardLeftSpread, cardWidth} = dimensions;
  //const { image } = card;
  const id = "ghostCard" + image;
  console.log(index)
  
  //const cardIndex = offsetWithinCardGroup !==undefined ? offsetWithinCardGroup : index;
  return (
    <Transition in={true} timeout={0} appear={true}>
      {(state) => (
        <img
          alt={image}
          src={`./images/${image}.jpg`}
          id={id}
          style={{
            WebkitFilter: "grayscale(100%)",
            opacity: state === "entered" ? 0.7 : 0.3,
            width: cardWidth,
            border: "thin solid",
            //left: props.left,
            left: (index) * cardLeftSpread + (offsetLeft || 0),
            top: dimensions.topOffset + (offsetTop || 0),
            rotate: rotation + "deg" || "0deg",
            position: "absolute",
            transition: "left 250ms ease, opacity 250ms",
            zIndex: 0,
          }}
        />
      )}
    </Transition>
  );
  };
export default GhostCard;
