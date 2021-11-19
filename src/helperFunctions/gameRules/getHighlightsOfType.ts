const playerPlacesTypes: PlaceType[] = ["GCZ", "UWZ", "specialsZone", "hand", "enchantmentsRow"];

const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

const checkCardsInPlace = (placeObject: GamePlace) => (placeObject.hasOwnProperty("GCZ") ? Object.entries(placeObject) : []);

//const getEntries = (id: string, obj: object) : any | [string, any] => typeof obj === "object" ? Array.isArray(obj) ? obj.getEntries(id, obj) : getEntries(id, Object.entries(obj)) :

// export const getAllOfType = (type: HighlightType, gameSnapshot:GameSnapshot): (GamePlace | GameCard | GamePlayer)[] => {
//   if (type === "place") return getAllPlayerPlaces(gameSnapshot);
//   else if (type === "player") return getAllPlayers(gameSnapshot);
//   else return getHighlightCards(gameSnapshot);
// };

export const getAllPlayerPlaces = (gameSnapshot: any): GamePlace[] =>
  gameSnapshot.players.reduce((acc: GamePlace[], player: GamePlayer) => Object.values(player.places).forEach(e => acc.concat(e)));

export const getAllCards = (gameSnapshot: any): GameCard[] =>
  gameSnapshot.players.reduce((acc: GameCard[], player: GamePlayer) =>
    Object.values(player.places).forEach(e => e.cards.forEach((i: GameCard) => acc.concat(i)))
  );

export const getAllPlayers = (gameSnapshot: any): GamePlayer[] => gameSnapshot.players;

//const locateRecursive = (id: string, obj: GameSnapshot | any[]) : string[] => typeof obj === "object" ? Array.isArray(obj) ? obj.reduce ((acc, value) => value.id === id ? acc.concat[] locateRecursive(id, obj) : Object.entries(obj).reduce((acc, [key, value])=> locateRecursive(id, value) : [] )

//export const getLegalTargets = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => gameSnapshot.players.map(player=> (Object.keys(player.places)).forEach(place => player.places[place].cards.forEach(card=> draggedCard.action?.cardHighlightType === card.cardType? push card. )

//if it finds one I want to do (draggedCard.action==="enchantBFF"? canEnchantWithBFF(draggedCard, higlightCard, gameSnaphot) ? return highlightCard.id)
//export default checkPlace
