import store from "../../redux/store";
import { canAddDragged, highlightFunctions} from "./highlightFunctions";
import { HighlightFunctions } from "./highlightFunctionTypes";

export const getHighlights = (draggedCard: GameCard) => {
  const gameSnapshot = store.getState().gameSnapshot;
  const { action } = draggedCard;
  const { highlightType, actionType } = action;

  // highlightFunctions is a nested object containing all highlight 
  // functions indexed first by type ("card", "place" or "player") and then 
  // by actionType ("addDragged", "steal", etc.)
  const functions: HighlightFunctions = highlightFunctions[highlightType];
  const highlightFunction = functions[actionType]
  // const potentialHighlights: (GameCard | GamePlace | GamePlayer) [] = getPotentialHighlights(highlightType);
  // const highlights: string [] = highlightFunction(potentialHighlights);
};

const playerPlacesTypes: PlaceType[] = ["GCZ", "UWZ", "specialsZone", "hand", "enchantmentsRow"];

const nonPlayerPlacesTypes: PlaceType[] = ["deck", "discardPile"];

const checkCardsInPlace = (placeObject: GamePlace) => (placeObject.hasOwnProperty("GCZ") ? Object.entries(placeObject) : []);

//const getEntries = (id: string, obj: object) : any | [string, any] => typeof obj === "object" ? Array.isArray(obj) ? obj.getEntries(id, obj) : getEntries(id, Object.entries(obj)) :

export const getHighlightPlaces = (draggedCard: GameCard, gameSnapshot: any): string[] =>
  gameSnapshot.players.reduce((player: GamePlayer) =>
    Object.values(player.places).reduce((acc: any[], place) => (canAddDragged(place, draggedCard, gameSnapshot) ? acc.concat(place.id) : acc), [])
  );
export const getHighlightCards = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => {};
//highlightPlace.

//const locateRecursive = (id: string, obj: GameSnapshot | any[]) : string[] => typeof obj === "object" ? Array.isArray(obj) ? obj.reduce ((acc, value) => value.id === id ? acc.concat[] locateRecursive(id, obj) : Object.entries(obj).reduce((acc, [key, value])=> locateRecursive(id, value) : [] )

//export const getLegalTargets = (draggedCard: GameCard, gameSnapshot: GameSnapshot) => gameSnapshot.players.map(player=> (Object.keys(player.places)).forEach(place => player.places[place].cards.forEach(card=> draggedCard.action?.cardHighlightType === card.cardType? push card. )

//if it finds one I want to do (draggedCard.action==="enchantBFF"? canEnchantWithBFF(draggedCard, higlightCard, gameSnaphot) ? return highlightCard.id)
//export default checkPlace
