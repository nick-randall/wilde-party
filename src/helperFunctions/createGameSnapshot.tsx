import { produce } from "immer";

export const createInitialGameSnapshot = (snapshot: GameSnapshot) =>  snapshot;
  // produce(snapshot, (draft) => {
  //   draft.players.forEach((player) => (player.places.enchantmentsRow.cards = createEnchantRowFillCards(player)));
  // });

const createEnchantRowFillCards = (player: GamePlayer) =>
  player.places.GCZ.cards
    .map((GCZcard, index) => player.places.enchantmentsRow.cards.find((enchantCard) => enchantCard.index === index))
    .map((card, index) => (card === undefined ? createFillCard(player, index) : card));


export const createFillCard = (player: GamePlayer, index: number): GameCard => {
  return {
    id: "fillCard" + player.id + index,
    name: "enchantmentFillCard",
    placeId: player.places.enchantmentsRow.id,
    playerId: player.id,
    index: index,
    pointValue: 0,
    bffs: false,
    zwilling: false,
    image: "",
    cardType: "fillCard",
    action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ" },
  };
};