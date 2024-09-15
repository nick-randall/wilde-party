type AnimationData = {
  cardId: number;
  placeId?: number;
  keyframesString: Keyframes;
  totalDuration: number;
  track: "main" | "opacityAndShadow" | "zIndex";
};

type OffsetArgs = {
  dx: number;
  dy: number;
};