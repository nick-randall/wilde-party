class CardObject {
  static currId: number = 0;

  constructor(
    name: string,
    placeId: string,
    playerId: string | null,
    index: number,
    image: string,
    cardType: CardType,
    pointValue: number,
    action: CardAction,
    guestCardType: GuestCardType | undefined = undefined,
    numGuestPlaces: number | undefined = undefined,
    specialsCardType: GuestCardType | undefined = undefined,
    blitzAction: BlitzActionType | undefined = undefined


  ) {
    this.id = CardObject.currId;
    CardObject.currId++;
    this.name = name;
    this.placeId = placeId;
    this.playerId = playerId;
    this.index = index;
    this.image = image;
    this.cardType = cardType;
    this.pointValue = pointValue;
    this.action = action;
    this.specialsCardType = specialsCardType;
    this.guestCardType = guestCardType;
    this.numGuestPlaces = numGuestPlaces;
    this.blitzAction = blitzAction;
  }

  id: number;
  name: string;
  playerId: string | null;
  placeId: string;
  index: number;
  image: string;
  cardType: CardType;
  pointValue: number;
  action: CardAction;
  guestCardType?: GuestCardType;
  specialsCardType?: GuestCardType;
  blitzAction?: BlitzActionType;
  numGuestPlaces?: number;
}

export default CardObject;
