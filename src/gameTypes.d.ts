type CardGroup = GameCard[];

type PlaceDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  leftOffset: number;
  topOffset: number;
  zIndex: number;
  featuredCardScale: number;
};

type CardDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  leftOffset: number;
  topOffset: number;
  draggedCardScale: number;
  draggedCardWidth: number;
  draggedCardzIndex: number;
  tableCardzIndex: number;
  rotation: number;
  featuredCardScale: number;
};

type AllDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  maxCardLeftSpread?: number;
  draggedCardScale: number;
  draggedCardWidth: number;
  draggedCardzIndex: number;
  tableCardzIndex: number;
  rotation: (index: number) => number;
  scale: number;
  featuredCardScale: number;
  zIndex: number;
  handToTableScaleFactor: number;
  tableCardHeight: number;
  tableCardWidth: number;
  // leftOffset: number;
  // topOffset: number;
};

type SnapshotUpdateType =
  | "initialSnapshot"
  | "dealingInitialCards"
  | "dealingCards"
  | "rearrangingHand"
  | "rearrangingTablePlace"
  | "drawingWildeParty"
  | ActionType;

type LegalTargetType = "player" | "place" | "card";

type GameCard = {
  [key: string]: value;
  id: number;
  name: string;
  playerId?: number; // player should be an id ??
  placeId: number; // place should be an id ??
  index: number;
  image: string;
  cardType: CardType;
  pointValue: number;
  guestCardType?: GuestCardType;
  specialsCardType?: GuestCardType;
  blitzAction?: BlitzActionType;
  numGuestPlaces?: number;
  action: CardAction;
};

type PlaceActionType = "addDragged" | "rearrange";

type CardActionType = "destroy" | "steal" | "enchantWithBff" | "enchant" | "swap";

type PlayerActionType = "protectSelf";

type BlitzActionType = "";

type ActionType = PlaceActionType | CardActionType | PlayerActionType;

type CardHighlightType = "card" | "place" | "player" | "";

type TargetPlayerType = "enemy" | "self";

type CardAction = {
  actionType: ActionType;
  highlightType: CardHighlightType;
  targetPlayerType: TargetPlayerType;
  cardHighlightType?: CardType;
  placeHighlightType?: PlaceType;
};

type LocationData = { droppableId: number; index: number };

type CardType = "guest" | "unwanted" | "instant" | "interrupt" | "bff" | "zwilling" | "fillCard" | "ghostCard" | "special";

type GuestCardType = "saufnase" | "taenzerin" | "schleckermaul" | "rumgroelerin" | "";

type GhostCard = {
  index: number;
  player: number;
  place: PlaceType;
};

type PlaceType = "GCZ" | "UWZ" | "specialsZone" | "hand" | "deck" | "discardPile" | "enchantmentsRow";

// DB prototype
type Place = {
  id: number;
  maxNumCards: number;
  acceptedCardType: CardType;
  player: number;
};
// Game object
type GamePlace = {
  id: number;
  placeType: PlaceType;
  playerId?: number;
  cards: GameCard[];
  acceptedCardType?: CardType;
};

type GamePlayer = {
  id: number;
  name: string;
  places: PlayerPlaces;
  glitzaglitza: boolean;
  skipNextTurn: boolean;
};
type Phase = "dealPhase" | "playPhase" | "drawPhase" | "rollPhase" | "counterPhase";

type PlayerPlaces = {
  [type: string]: GamePlace;
};

type NonPlayerPlaces = {
  [type: string]: GamePlace;
};

type Current = {
  player: number;
  phase: Phase;
  plays: number;
  draws: number;
  rolls: number;
};

type GameSnapshot = {
  current: Current;
  players: GamePlayer[];
  nonPlayerPlaces: NonPlayerPlaces;
  snapshotUpdateData: SnapshotUpdateData;
};

type CardTransitionData = {
  origin: TopLeftCoordinates;
  wait: number; // if transition is not first in the queue
  duration: number;
  animation: AnimationData;
};

// type LocationData = {

// }

type TransitionData = {
  cardId: number;
  originDelta: TopLeftCoordinates;
  wait: number; // if transition is not first in the queue
  duration: number;
  curve: string;
  originDimensions: AllDimensions;
  cardInitialrotation: number;
  startAnimationDuration: number;
  startAnimation: string;
};

type TransitionDataEvents = {
  card: GameCard;
  origin: TopLeftCoordinates;
  animation: AnimationData;
  duration: number;
}[];

type Refs = {
  [id: number]: HTMLElement;
};


type Hover = "shortHover" | "longHover" | "none";
