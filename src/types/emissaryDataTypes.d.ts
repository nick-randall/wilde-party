type SendEmissaryDispatch = {
  type: "SEND_EMMISARY_DISPATCH";
  payload: {
    id: string;
    xPosition: number;
    yPosition: number;
  };
};
