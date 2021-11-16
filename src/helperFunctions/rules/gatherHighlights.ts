import { canAdd } from "./rulesFunctions";

const playerPlacesTypes: PlaceType[] = ["GCZ", "UWZ", "specialsZone", "hand", "enchantmentsRow"];

const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

const checkPlace = (placeObject: GamePlace) => (placeObject.hasOwnProperty("GCZ") ? Object.entries(placeObject) : []);

//const getEntries = (id: string, obj: object) : any | [string, any] => typeof obj === "object" ? Array.isArray(obj) ? obj.getEntries(id, obj) : getEntries(id, Object.entries(obj)) :

export const gatherHighlights = (draggedCard: GameCard, gameSnapshot: GameSnapshot): string[] => {
  let legalTargets: string[] = [];
  switch (draggedCard.action?.actionType) {
    case undefined:
      legalTargets = [];
      break
    case "addDragged":
      legalTargets = getHighlightPlaces(draggedCard, gameSnapshot);
      break;
    default:
      legalTargets = [];
  }
  return legalTargets;
};

export const getHighlightPlaces = (draggedCard: GameCard, gameSnapshot: any): string[] =>
  gameSnapshot.players.reduce((player: GamePlayer) =>
    Object.values(player.places).reduce(
      (acc: any[], place) => (canAdd(place, draggedCard, gameSnapshot) ? acc.concat(place.id) : acc),
      []
    )
  );
export const getHighlightCards = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => {};
//highlightPlace.

//const locateRecursive = (id: string, obj: GameSnapshot | any[]) : string[] => typeof obj === "object" ? Array.isArray(obj) ? obj.reduce ((acc, value) => value.id === id ? acc.concat[] locateRecursive(id, obj) : Object.entries(obj).reduce((acc, [key, value])=> locateRecursive(id, value) : [] )

//export const getLegalTargets = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => gameSnapshot.players.map(player=> (Object.keys(player.places)).forEach(place => player.places[place].cards.forEach(card=> draggedCard.action?.cardHighlightType === card.cardType? push card. )

//if it finds one I want to do (draggedCard.action==="enchantBFF"? canEnchantWithBFF(draggedCard, higlightCard, gameSnaphot) ? return highlightCard.id)
//export default checkPlace
