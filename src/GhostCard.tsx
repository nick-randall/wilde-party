//import { Transition } from "react-transition-group";
interface GhostCardProps {
  index: number;
  //left: string;
  //card: GameCard;
  image: string;
  offsetWithinCardGroup?: number;
  dimensions: CardDimensions;
  rotation?: number;
}

export const GhostCard = (props: GhostCardProps) => {
  const { dimensions, rotation, image, index, offsetWithinCardGroup } = props;
  const {cardLeftSpread, cardWidth,  leftOffset, tableCardzIndex } = dimensions;
  //const { image } = card;
  const id = "ghostCard" + image;
  console.log(index)
  
  //const cardIndex = offsetWithinCardGroup !==undefined ? offsetWithinCardGroup : index;
  return (
    // <Transition in={true} timeout={0} appear={true}>
    //   {(state) => (
        <img
          alt={image}
          src={`./images/${image}.jpg`}
          id={id}
          style={{
            WebkitFilter: "grayscale(100%)",
            // opacity: state === "entered" ? 0.7 : 0.3,
            width: cardWidth,
            border: "thin solid",
            //left: props.left,
            left: (index) * cardLeftSpread,
            top: dimensions.topOffset,
            rotate: rotation + "deg" || "0deg",
            position: "relative",
            transition: "left 250ms ease, opacity 250ms",
            zIndex: 0,
          }}
        />
    //   )}
    // </Transition>
  );
  };
export default GhostCard;
