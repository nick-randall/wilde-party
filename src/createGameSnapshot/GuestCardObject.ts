import CardObject from "./CardObject";

class GuestCardObject extends CardObject {
  constructor(
    name: string,
    placeId: string,
    playerId: string | null,
    index: number,
    image: string,
    pointValue: number,
    guestCardType: GuestCardType,
    numGuestPlaces: number,
    action: CardAction
  ) {
    super(name, placeId, playerId, index, image, "guest", pointValue, action, guestCardType, numGuestPlaces);
  }
}

export default GuestCardObject;
