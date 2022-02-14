import { v4 as uuidv4 } from "uuid";
import shuffle from "../helperFunctions/shuffle";
import createSpecialsAndGuests from "./createSpecialsAndGuests";
import createUnwanteds from "./createUnwanteds";
import createDestroyCards from "./createDestroyCards";
import createEnchantCards from "./createEnchantCards";

export const createDeck = () => {
  const deck: GameCard[] = [];
  const specialsAndGuests = createSpecialsAndGuests();
  const unwanteds = createUnwanteds();
  const enchantCards = createEnchantCards();
  const destroyCards = createDestroyCards();
  deck.push(...specialsAndGuests);
  deck.push(...unwanteds);
  deck.push(...enchantCards);
  //deck.push(...destroyCards);

  return deck;
};

const setDeckIndexes = (deck: GameCard[]) => deck.map((card, i) => ({ ...card, index: i }));

const setDeckPlaceId = (deck: GameCard[], deckId: string) => deck.map(card => ({ ...card, placeId: deckId }));

export const getPreppedDeck = (): { deck: GameCard[]; deckId: string } => {
  const deckId = uuidv4();
  let deck = createDeck();
  const shuffledDeck = shuffle(deck);
  const withIndexes = setDeckIndexes(shuffledDeck);
  const withPlaceId = setDeckPlaceId(withIndexes, deckId);

  return { deck: withPlaceId, deckId: deckId };
};

// fix place and player ids

export const deal = (cards: GameCard[]) => {};

// const setDeckIndexes = () ={}
