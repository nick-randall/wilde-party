// A function to insert an array into the middle of another


export const insert = (arrayToInsert: any[], index: number, arrayToReceiveItems: any[]):any[] => {
  return [...arrayToReceiveItems.slice(0, index), ...arrayToInsert, ...arrayToReceiveItems.slice(index)];
};
