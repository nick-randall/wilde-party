import { cleverGetNextAiCard } from "../ai/getNextAiCard";
import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions";
import store, { RootState } from "../redux/store";
import { addDraggedThunk, drawCardThunk, enchantThunk, endCurrentTurnThunk } from "../redux/thunks";
import destroyCardThunk from "./destroyCardThunk";

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
  let numTimesWaited = 0;
  console.log("ai waiting");

  const waitThenDraw = () => {
    if (getState().transitionData.length < 1 || numTimesWaited > 10) dispatch(drawCardThunk(player));
    else
      setTimeout(() => {
        numTimesWaited += 1;
        waitThenDraw();
        const state = getState();
        const transitionData = state.transitionData;
        console.log(transitionData ? locate(transitionData[0].cardId, state.gameSnapshot) : "");
      }, 50);
  };
  waitThenDraw();

  const tryToPlayACard = (tries: number) => {
    gameSnapshot = getState().gameSnapshot;
    if (tries >= 10)
      //gameSnapshot.players[player].places.hand.cards.length)
      dispatch(endCurrentTurnThunk());
    if (tries > 1) console.log("tries ", tries);
    const randomCard = cleverGetNextAiCard(player, gameSnapshot);
    const hand = gameSnapshot.players[player].places.hand;

    if (randomCard === undefined) dispatch(endCurrentTurnThunk());
    else {
      const potentialTargets = getHighlights(randomCard, gameSnapshot);
      dispatch({ type: "SET_HIGHLIGHTS", payload: randomCard });
      if (potentialTargets.length === 0) {
        console.log(randomCard.name + " has no targets, trying again");
        tryToPlayACard(tries + 1);
      }
      // if (potentialTargets.length > 0) {
      else {
        dispatch({ type: "SET_AI_PLAYING", payload: randomCard.id });
        console.log("potential targets > 0")
        console.log(potentialTargets)
        gameSnapshot = getState().gameSnapshot;

        // should choose a random target, currently just getting target[0]

        const action = randomCard.action;

        const waitThenPlay = () => {
          if (getState().transitionData.length < 1) {
            gameSnapshot = getState().gameSnapshot;
            const hand = gameSnapshot.players[player].places.hand;
            const index = hand.cards.map(c => c.id).indexOf(randomCard.id);

            switch (action.actionType) {
              case "addDragged": {
                dispatch(
                  addDraggedThunk({
                    source: { containerId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                    destination: { containerId: potentialTargets[0], index: 0 },
                  })
                );
                break;
              }
              case "enchant": {
                dispatch(
                  enchantThunk({
                    source: { containerId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                    destination: { containerId: potentialTargets[0], index: 0 },
                  })
                );
                break;
              }
              case "enchantWithBff":
                dispatch(
                  enchantThunk({
                    source: { containerId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                    destination: { containerId: potentialTargets[0], index: 0 },
                  })
                );
                break;
            
            case "destroy":
              dispatch(
                destroyCardThunk({
                  source: { containerId: hand.id, index: hand.cards.map(c => c.id).indexOf(randomCard.id) },
                  destination: { containerId: potentialTargets[0], index: 0 },
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
      }
    }
  };
  tryToPlayACard(0);
  console.log("got here");
};

export default enactAiPlayerTurnThunk;
