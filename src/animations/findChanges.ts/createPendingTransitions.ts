import { getAllDimensions } from "../../helperFunctions/getDimensions";

const createPendingTransitions= (snapshotChanges: SnapshotChange[], snapshotUpdateType: SnapshotUpdateType): TransitionSet  => {
  const pendingTransition = {
    cardId: "string",
    originDelta: { left: 0, top: 0 }, //xPosition TopLeftCoordinates;
    wait: 0, // if transition is not first in the queue
    duration: 0,
    curve: "string",
    originDimensions: getAllDimensions("string"),
    cardInitialrotation: 0,
    startAnimationDuration: 0,
    startAnimation: "string",
  };

  return { status: "pending", transitions: [pendingTransition] };
};

export default createPendingTransitions;
