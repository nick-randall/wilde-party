import { v4 as uuidv4 } from "uuid";

const getCurrCardId = (currCardId: number) => currCardId+= 2323207;

const createEnchantCards = (currCardId: number): GameCard[] => {
  const numEnchantCardsPerType = 2;
  let enchantCards: GameCard[] = [];
  for (let i = 0; i < numEnchantCardsPerType + 1; i++) {
    const bff: GameCard = {
      id: Math.floor(Math.random() * 10000000000000),
      name: `bffs${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      imageName: `bffs`,
      pointValue: 0,
      cardType: "bff",
      action: { actionType: "enchantWithBff", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
    };
    enchantCards.push(bff);
    const zwilling: GameCard = {
      id: Math.floor(Math.random() * 10000000000000),
      name: `zwilling${i}`,
      placeId: -1,
      playerId: -1,
      index: 0,
      imageName: `zwilling`,
      pointValue: 0,
      cardType: "zwilling",
      action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
    };
    enchantCards.push(zwilling);
  }
  return enchantCards;
};

export default createEnchantCards;
