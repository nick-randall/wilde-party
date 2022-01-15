import { cleverGetNextAiCard } from "../ai/getNextAiCard";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions";
import { RootState } from "../redux/store";
import { addDraggedThunk, drawCardThunk, enchantThunk, endCurrentTurnThunk } from "../redux/thunks";

const enactAiPlayerTurnThunk = (player: number) => (dispatch: Function, getState: () => RootState) => {
  let { gameSnapshot } = getState();
  let { draws } = gameSnapshot.current;
  let numCardsInDeck = gameSnapshot.nonPlayerPlaces.deck.cards.length;
  // setTimeout(() => {
  // while (draws > 0 && numCardsInDeck > 0) {
  //   dispatch(drawCardThunk(player));
  //   const { gameSnapshot } = getState();
  //   draws = gameSnapshot.current.draws;
  //   numCardsInDeck = gameSnapshot.nonPlayerPlaces.deck.cards.length;
  // }
  console.log("ai waiting");

  const waitThenDraw = () => {
    if (getState().transitionData.length < 1) dispatch(drawCardThunk(player));
    else
      setTimeout(() => {
        waitThenDraw();
        const state = getState();
        const transitionData = state.transitionData;
        console.log(transitionData ? locate(transitionData[0].cardId, state.gameSnapshot) : "");
      }, 50);
  };
  waitThenDraw();
  // }, 1000);

  const tryToPlayACard = () => {
    gameSnapshot = getState().gameSnapshot;

    const randomCard = cleverGetNextAiCard(player, gameSnapshot);
    const hand = gameSnapshot.players[player].places.hand;
    console.log(hand.cards);
    console.log("randomcard index is ", randomCard ? randomCard.index : "undefined");

    if (randomCard === undefined) dispatch(endCurrentTurnThunk());
    else {
      const potentialTargets = getHighlights(randomCard, gameSnapshot);
      if (potentialTargets.length === 0) {
        console.log(randomCard.name + " has no targets, trying again");
        tryToPlayACard();
      }
      // if (potentialTargets.length > 0) {
      else {
        console.log("ai chose card ", randomCard.name);
        console.log(hand.cards);

        gameSnapshot = getState().gameSnapshot;

        // should choose a random target, currently just getting target[0]

        const action = randomCard.action;
        console.log(action);

        const waitThenPlay = () => {
          if (getState().transitionData.length < 1) {
            gameSnapshot = getState().gameSnapshot;
            const hand = gameSnapshot.players[player].places.hand;
            const index = hand.cards.map(c => c.id).indexOf(randomCard.id);
            console.log("AI playing randomcard ", randomCard.name);
            const { player: targetplayer, place } = locate(potentialTargets[0], gameSnapshot);
            console.log(place, targetplayer);
            if (place && targetplayer) {
              console.log(
                "target is ",
                gameSnapshot.players[targetplayer].places[place].cards.find(e => e.id === potentialTargets[0])
              );
            }
            switch (action.actionType) {
              case "addDragged": {
                dispatch(
                  addDraggedThunk({
                    source: { droppableId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                    destination: { droppableId: potentialTargets[0], index: 0 },
                  })
                );
                break;
              }
              case "enchant": {
                // const enchantmentsRow = potentialTargets[0].
                console.log("AI trying to enchant");
                console.log("card", locate(potentialTargets[0], gameSnapshot));
                dispatch(
                  enchantThunk({
                    source: { droppableId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                    destination: { droppableId: potentialTargets[0], index: 0 },
                  })
                );
                break;
              }
              case "enchantWithBff":
                console.log("made it to enchant with BFF");
                 // const enchantmentsRow = potentialTargets[0].
                 console.log("AI trying to enchant");
                 console.log("card", locate(potentialTargets[0], gameSnapshot));
                 dispatch(
                   enchantThunk({
                     source: { droppableId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                     destination: { droppableId: potentialTargets[0], index: 0 },
                   })
                 );
                 break;
            }
          } else
            setTimeout(() => {
              console.log("ai waiting for transition", getState().transitionData);
              waitThenPlay();
            }, 50);
        };
        waitThenPlay();
        // } else {
        //   console.log("potential targets");
        //   console.log(potentialTargets);
      }
    }
  };
  tryToPlayACard();
};

export default enactAiPlayerTurnThunk;
