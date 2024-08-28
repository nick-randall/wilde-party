import { v4 as uuidv4 } from "uuid";
import shuffle from "../shuffle"
import createSpecialsAndGuests from "./createSpecialsAndGuests";
import createUnwanteds from "./createUnwanteds";
import createDestroyCards from "./createDestroyCards";
import createEnchantCards from "./createEnchantCards";

let currCardId = 0;

export const createDeck = () => {
  const deck: GameCard[] = [];
  const specialsAndGuests = createSpecialsAndGuests(currCardId);
  const unwanteds = createUnwanteds(currCardId);
  const enchantCards = createEnchantCards(currCardId);
  const destroyCards = createDestroyCards(currCardId);
  deck.push(...specialsAndGuests);
  deck.push(...unwanteds);
  deck.push(...enchantCards);
  //deck.push(...destroyCards);
  for(const card of deck){ 
    if(deck.filter(c => c.id === card.id).length > 1){
      card.id = Math.floor(Math.random() * 10000000000000);
    }
  }
  return deck;
};

const setDeckIndexes = (deck: GameCard[]) => deck.map((card, i) => ({ ...card, index: i }));

const setDeckPlaceId = (deck: GameCard[], deckId: number): GameCard[] => deck.map(card => ({ ...card, placeId: deckId }));

export const getPreppedDeck = (): { deck: GameCard[]; deckId: number } => {
  const deckId = 10000000000;
  let deck = createDeck();
  const shuffledDeck = shuffle(deck);
  const withIndexes = setDeckIndexes(shuffledDeck);
  const withPlaceId = setDeckPlaceId(withIndexes, deckId);

  return { deck: withPlaceId, deckId: deckId };
};

// fix place and player ids

export const deal = (cards: GameCard[]) => {};

// const setDeckIndexes = () ={}
