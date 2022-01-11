const startGaeste : GameCard[] = [
  {
    id: "092832908423",
    name: "startgast_saufnase",
    playerId: "l93fld9",
    placeId: "pd0s9fd",
    index: 0,
    image: "startgast_saufnase",
    cardType: "guest",
    pointValue: 1,
    guestCardType: "saufnase", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "01293219312832183",
    name: "startgast_taenzerin",
    playerId: "enemy",
    placeId: "2kopvjops",
    index: 1,
    image: "startgast_taenzerin", //TODO change
    cardType: "guest",
    pointValue: 1,
    guestCardType: "taenzerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "kkkkkkkkk",
    name: "startgast_rumgroelerin",
    placeId: "2kopvjops",
    playerId: "enemy",
    index: 0,
    image: "startgast_rumgroelerin", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "rumgroelerin", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "50340395343",
    name: "startgast_schleckermaul",
    playerId: "enemy",
    placeId: "2kopvjops",
    index: 2,
    image: "startgast_schleckermaul", //TODO change
    pointValue: 1,
    cardType: "guest",
    guestCardType: "schleckermaul", //???
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },
  {
    id: "50340395343",
    name: "startgast_unscheinbar",
    playerId: "enemy",
    placeId: "2kopvjops",
    index: 2,
    image: "startgast_unscheinbar", //TODO change
    pointValue: 1,
    cardType: "guest",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
  },

]

export const prepStartGast = (card: GameCard, playerId:string, GCZId: string) :GameCard => ({...card, placeId: GCZId, playerId: playerId})


export default startGaeste;