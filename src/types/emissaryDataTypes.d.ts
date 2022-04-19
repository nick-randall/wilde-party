type SendEmissaryDispatch = {
  type: "SEND_EMMISARY_FROM_DISPATCH";
  payload: EmissaryFromData;
};

type SendEmissaryToDispatch = {
  type: "SEND_EMMISARY_TO_DISPATCH";
  payload: EmissaryToData;
};

type EmissaryFromData = { cardId: string; xPosition: number; yPosition: number; rotation: number; dimensions: AllDimensions };

type EmissaryToData = { cardId: string; xPosition: number; yPosition: number };
