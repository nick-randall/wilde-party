import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions";
import { Action } from "./actions";
import { drawCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/drawCard";
import { produce } from "immer";
import { createGameSnapshot } from "../createGameSnapshot/createGameSnapshot";
import { dealStartingGuestUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/dealStartingGuest";
import { destroyCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/destroy";
import { remove } from "ramda";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

export interface State {
  gameSnapshot: GameSnapshot;
  newSnapshots: NewSnapshot[];
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
  screenSize: { width: number; height: number };
  // snapshotChangeData: SnapshotCh[];
  transitionData: TransitionData[];
  dragUpdate: UpdateDragData;
  BFFdraggedOverSide: string | undefined;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard: GameCard | undefined;
  highlights: string[];
  highlightType: string;
  aiPlaying: string;
}

const initialDragState = {
  draggedState: { draggedId: undefined, source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
};

export const stateReducer = (
  state: State = {
    gameSnapshot: createGameSnapshot(),
    newSnapshots: [],
    screenSize: getScreenSize(),
    dragContainerExpand: initialDragState.dragContainerExpand,
    draggedState: initialDragState.draggedState,
    // snapshotChangeData: [],
    dragUpdate: { droppableId: "", index: -1 },
    BFFdraggedOverSide: undefined,
    transitionData: [],
    rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
    aiPlaying: "",
  },
  action: Action
) => {
  switch (action.type) {
    case "SET_SCREEN_SIZE":
      return { ...state, screenSize: getScreenSize() };
    case "SET_DRAGGED_ID":
      const draggedId = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggedId);
      return { ...state, draggedId: draggedId, draggedHandCard: draggedHandCard };
    case "SET_INITIAL_DRAGGED_STATE": {
      const { draggedId, source, destination } = action.payload;
      const draggedHandCard = state.gameSnapshot.players[0].places.hand.cards.find(e => e.id === draggedId);

      // TODO remove this code!!!!
      // It is only here so that adding to GCZ is possible for any card.
      // we need a proper check before adding highlights!!!
      const isHandCard = locate(source?.containerId || "", state.gameSnapshot).place === "hand";
      const GCZId = isHandCard ? state.gameSnapshot.players[0].places["GCZ"].id : "";
      //
      return {
        ...state,
        draggedState: { draggedId: draggedId, source: source, destination: destination },
        draggedHandCard: draggedHandCard,
        //
        highlights: [GCZId],
        ///
      };
    }

    case "UPDATE_DRAG_DESTINATION":
      const { destination } = action.payload;
      return { ...state, draggedState: { ...state.draggedState, destination: destination } };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialDragState.draggedState,
        draggedHandCard: undefined,
        dragContainerExpand: initialDragState.dragContainerExpand,
        highlights: [],
      };
    case "REMOVE_NEW_SNAPSHOT":
      const id = action.payload;
      console.log("removing snapshot with id " + id);
      const newSnapshots = state.newSnapshots.filter(e => e.id !== id);
      return { ...state, newSnapshots };
    case "SET_NEW_SNAPSHOT": {
      const newSnapshot = action.payload;
      const { id } = newSnapshot;
      const newSnapshots = state.newSnapshots.map(e => (e.id === id ? newSnapshot : e));
      return { ...state, ...newSnapshots };
    }
    case "SET_NEW_GAME_SNAPSHOTS" : {
      return {...state, newSnapshots: action.payload}
    }
    case "OVERWRITE_CURRENT_SNAPSHOT":
      console.log("overwriting current snapshot")
      return { ...state, gameSnapshot: action.payload };

    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };

    case "ADD_NEW_GAME_SNAPSHOTS":
      console.log(state.newSnapshots);
      console.log("adding new game snapshot");
      // they should already be in the right order and the first snapshot should
      // have added transitionTemplates already---if there weren't already
      // others in the stack
      return { ...state, newSnapshots: state.newSnapshots.concat(action.payload) };
    case "UPDATE_TRANSITION_TEMPLATE": {
      const template = action.payload;
      const { id } = template;
      const currentTemplates = state.newSnapshots[0].transitionTemplates;
      const transitionTemplates = currentTemplates.map(e => (e.id === id ? template : e));
      const newSnapshots = state.newSnapshots.map((e, i) => (i === 0 ? { ...e, transitionTemplates } : e));
      console.log("update transition template, new snapshots: ", newSnapshots)

      return { ...state, newSnapshots };
    }
    case "ADD_TRANSITION":
      const newTransition = action.payload;
      return { ...state, transitionData: [...state.transitionData, newTransition] };
    case "SET_HIGHLIGHTS": {
      // if(!phaseNormalTurnIsYours) return state;
      const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        const highlightType = draggedHandCard.action.highlightType;
        return { ...state, highlights, highlightType };
      } else return state;
    }
    case "DEAL_STARTING_GUEST": {
      console.log("deal starting guest");
      const player = action.payload;
      const gameSnapshot = dealStartingGuestUpdateSnapshot(player, state.gameSnapshot);
      return { ...state, gameSnapshot };
    }
    case "DESTROY_CARD": {
      const targetCardId = action.payload;
      console.log("destroy card", targetCardId);

      const gameSnapshot = destroyCardUpdateSnapshot(targetCardId, state.gameSnapshot);

      return { ...state, gameSnapshot };
    }
    case "DRAW_CARD":
      if (state.gameSnapshot.nonPlayerPlaces.deck.cards.length === 0) return state;
      const { player, handId } = action.payload;
      const gameSnapshot = drawCardUpdateSnapshot(handId, player, state.gameSnapshot);
      return { ...state, gameSnapshot };

    // return { ...state, gameSnapshot, transitionData: [...state.transitionData, newTransition] };
    case "END_DRAG_CLEANUP":
      return {
        ...state,
        draggedHandCard: undefined,
        highlights: [],
        highlightType: "",
        dragUpdate: { droppableId: "", index: -1 },
        BFFdraggedOverSide: undefined,
        rearrangingData: { placeId: "", draggableId: "", sourceIndex: -1 },
      };
    case "REMOVE_TRANSITION":
      const transitionData = state.transitionData.filter(td => td.cardId !== action.payload);
      return { ...state, transitionData };
    case "CHANGE_NUM_DRAWS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.draws += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "CHANGE_NUM_PLAYS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.plays += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "CHANGE_NUM_ROLLS": {
      const change = action.payload;
      const newSnapshot = produce(state.gameSnapshot, draft => {
        draft.current.draws += change;
      });
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "END_CURRENT_PHASE":
      // currently only ends the deal phase
      const phases: Phase[] = ["dealPhase", "playPhase", "drawPhase", "rollPhase", "counterPhase"];
      const newSnapshot = produce(state.gameSnapshot, draft => {
        switch (state.gameSnapshot.current.phase) {
          case "dealPhase":
            draft.current.phase = "drawPhase";
            break;
          case "drawPhase":
            draft.current.phase = "playPhase";
            break;
          default:
            draft.current.phase = "playPhase";
        }
      });
      return { ...state, gameSnapshot: newSnapshot };
    case "END_CURRENT_TURN": {
      const { gameSnapshot } = state;
      const newSnapshot = produce(gameSnapshot, draft => {
        draft.current.player = nextPlayer(gameSnapshot);
        draft.current.draws = 1;
        draft.current.plays = 1;
        draft.current.rolls = 1;
        draft.current.phase = "drawPhase";
      });
      // console.log(newSnapshot);
      return { ...state, gameSnapshot: newSnapshot };
    }
    case "SET_AI_PLAYING": {
      console.log("setting playing", action.payload);
      return { ...state, aiPlaying: action.payload };
    }
    default:
      return state;
  }
};

export default stateReducer;
