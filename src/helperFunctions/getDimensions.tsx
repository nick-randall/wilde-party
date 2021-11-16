import { useSelector } from "react-redux";
import store, { RootState } from "../redux/store";
import { getNumCards, locate } from "./locateFunctions";

export const getPlaceDimensions = (placeId: string, gameSnapshot: GameSnapshot) => {
  const { place } = locate(placeId, gameSnapshot);

  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);
  const dimensions: PlaceDimensions = {
    cardHeight: placeType !== "hand" ? 160 : 160,
    cardWidth: placeType !== "hand" ? (numCards < 7 ? 102 : 75) : 102,
    cardLeftSpread: place !== "hand" ? (numCards < 7 ? 102 : 75) : 102,
    cardTopSpread: place === "specialsZone" ? -30 : 0,
    leftOffset: placeType !== "enchantmentsRow" ? 0 : numCards < 7 ? 32.5 : 17.5,
    topOffset: placeType !== "enchantmentsRow" ? 0 : 65,
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
  };
  return dimensions;
};

const convertGhostCardId = (id: string) => id.substr(0, id.length - 1).replace("ghostCard", "");

export const getCardDimensions = (card: GameCard, gameSnapshot: GameSnapshot) => {
  const cardId = card.cardType === "ghostCard" ? convertGhostCardId(card.id) : card.id;
  const { place, player } = locate(cardId, gameSnapshot);

  let placeId: string;
  if (player !== null) placeId = gameSnapshot.players[player].places[place].id;
  else {
    console.log(cardId);
    placeId = gameSnapshot.nonPlayerPlaces[place].id;
  }
  const numCards = getNumCards(placeId, gameSnapshot);
  const dimensions: CardDimensions = {
    cardHeight: place !== "hand" ? 160 : 200,
    cardWidth: place !== "hand" ? 102 : 125,
    cardLeftSpread: place === "specialsZone" ? 0 : place === "hand" ? (numCards / 2 - 0.5) * 1 : numCards < 7 ? 102 : 75,
    cardTopSpread: place === "specialsZone" ? -36 : 0,
    leftOffset: (place === "enchantmentsRow" && card.cardType === "bff") || card.ghostCardType === "bff" ? (numCards < 7 ? 51 : 25) : 0,
    topOffset: place !== "enchantmentsRow" ? 0 : 65,
    draggedCardWidth: 112,
    draggedCardScale: 1.1,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    tableCardzIndex: place === "enchantmentsRow" ? 5 : place === "hand" ? 9 : 7,
    rotation: place === "hand" ? (numCards / 2 - 0.5) * 10 : 0,
  };
  return dimensions;
};

export const getPlaceDimensions2 = (placeId: string) => {
  const gameSnapshot = store.getState().gameSnapshot;
  const { place } = locate(placeId, gameSnapshot);

  const placeType = place;
  const numCards = getNumCards(placeId, gameSnapshot);
  const dimensions: PlaceDimensions = {
    cardHeight: placeType !== "hand" ? 160 : 160,
    cardWidth: placeType !== "hand" ? (numCards < 7 ? 102 : 75) : 102,
    cardLeftSpread: place !== "hand" ? (numCards < 7 ? 102 : 75) : 102,
    cardTopSpread: place === "specialsZone" ? -30 : 0,
    leftOffset: placeType !== "enchantmentsRow" ? 0 : numCards < 7 ? 32.5 : 17.5,
    topOffset: placeType !== "enchantmentsRow" ? 0 : 65,
    zIndex: placeType !== "enchantmentsRow" ? 3 : 5,
  };
  return dimensions;
};

export const getCardDimensions2 = (card: GameCard) => {
  const gameSnapshot = store.getState().gameSnapshot;
  const cardId = card.cardType === "ghostCard" ? convertGhostCardId(card.id) : card.id;
  const { place, player } = locate(cardId, gameSnapshot);

  let placeId: string;
  if (player !== null) placeId = gameSnapshot.players[player].places[place].id;
  else {
    console.log(cardId);
    placeId = gameSnapshot.nonPlayerPlaces[place].id;
  }
  const numCards = getNumCards(placeId, gameSnapshot);// we need to get 
  const dimensions: CardDimensions = {
    cardHeight: place !== "hand" ? 160 : 200,
    cardWidth: place !== "hand" ? 102 : 125,
    cardLeftSpread: place === "specialsZone" ? 0 : place === "hand" ? (numCards / 2 - 0.5) * 1 : numCards < 7 ? 102 : 75,
    cardTopSpread: place === "specialsZone" ? -36 : 0,
    leftOffset: (place === "enchantmentsRow" && card.cardType === "bff") || card.ghostCardType === "bff" ? (numCards < 7 ? 51 : 25) : 0,
    topOffset: place !== "enchantmentsRow" ? 0 : 65,
    draggedCardScale: 1.1,
    draggedCardWidth: 112,
    draggedCardzIndex: place !== "enchantmentsRow" ? 6 : 7,
    //tableCardzIndex: place === "enchantmentsRow" ? 5 : place === "hand" ? 9 : 3,
    tableCardzIndex: place === "hand" ? 9: 3,
    rotation: place === "hand" ? (numCards / 2 - 0.5) * 10 : 0,
  };
  return dimensions;
};
