import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions";
import { Action } from "./actions";
import { drawCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/drawCard";
import { produce } from "immer";
import { createGameSnapshot } from "../createGameSnapshot/createGameSnapshot";
import { dealStartingGuestUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/dealStartingGuest";
import { destroyCardUpdateSnapshot } from "../helperFunctions/gameSnapshotUpdates/destroy";
import { remove } from "ramda";
import { changeGroupStatus, removeFirstElement } from "../animations/handleEndAnimation";
import { stat } from "fs";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

const isTemplateComplete = (currTemplate: AnimationTemplateNewVersion) =>
  currTemplate.to.xPosition !== undefined && currTemplate.from.xPosition !== undefined;

const updateTemplate = (template: AnimationTemplateNewVersion, array: AnimationTemplateNewVersion[][]) =>
  array.map(group => group.map(t => (t.id === template.id ? template : t)));

export interface State {
  gameSnapshot: GameSnapshot;
  newSnapshots: NewSnapshot[];
  newSnapshotsNewVersion: GameSnapshot[];
  draggedState: DraggedState;
  dragEndTarget?: DragEndTarget;
  dragContainerExpand: { width: number; height: number };
  screenSize: { width: number; height: number };
  animationData: AnimationData[];
  animationTemplates: AnimationTemplateNewVersion[][];
  transitionData: TransitionData[];
  dragUpdate: UpdateDragData;
  BFFdraggedOverSide?: string;
  rearrangingData: SimpleRearrangingData;
  draggedHandCard?: GameCard;
  highlights: string[];
  highlightType: string;
  aiPlaying: string;
}

const initialDragState = {
  draggedState: { draggedId: undefined, source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
  dragEndTarget: undefined,
};

export const stateReducer = (
  state: State = {
    gameSnapshot: createGameSnapshot(),
    newSnapshots: [],
    newSnapshotsNewVersion: [],
    screenSize: getScreenSize(),
    dragContainerExpand: initialDragState.dragContainerExpand,
    draggedState: initialDragState.draggedState,
    dragEndTarget: initialDragState.dragEndTarget,
    animationData: [],
    animationTemplates: [],
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

    case "SET_DRAG_END_TARGET":
      return { ...state, dragEndTarget: action.payload };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialDragState.draggedState,
        draggedHandCard: undefined,
        dragContainerExpand: initialDragState.dragContainerExpand,
        dragEndTarget: initialDragState.dragEndTarget,
        highlights: [],
      };
    case "REMOVE_NEW_SNAPSHOT":
      const id = action.payload;
      console.log("removing snapshot with id " + id);
      const newSnapshots = state.newSnapshots.filter(e => e.id !== id);
      return { ...state, newSnapshots };
    case "SET_NEW_SNAPSHOT": {
      const newSnapshot = action.payload;
      console.log("setting new snapshot");
      const { id } = newSnapshot;
      const newSnapshots = state.newSnapshots.map(e => (e.id === id ? newSnapshot : e));
      return { ...state, ...newSnapshots };
    }
    case "SET_NEW_SNAPSHOTS_NEW_VERSION": {
      const newSnapshots: GameSnapshot[] = action.payload;
      const sortedNewSnapshots = newSnapshots.sort((a, b) => a.id + b.id);
      console.log("setting new snapshots");
      return { ...state, newSnapshotsNewVersion: sortedNewSnapshots };
    }
    case "SET_NEW_GAME_SNAPSHOTS": {
      return { ...state, newSnapshots: action.payload };
    }

    case "OVERWRITE_CURRENT_SNAPSHOT":
      console.log("overwriting current snapshot");
      return { ...state, gameSnapshot: action.payload };

    case "OVERWRITE_CURRENT_SNAPSHOT_NEW_VERSION": {
      const newSnapshotsNewVersion = state.newSnapshotsNewVersion.filter((a, i) => i > 0);
      console.log(newSnapshotsNewVersion);
      console.log("#s############");
      return { ...state, newSnapshotsNewVersion, gameSnapshot: action.payload };
    }
    case "SET_ANIMATION_TEMPLATES": {
      console.log("setting these animation templates");
      console.log(action.payload);
      return { ...state, animationTemplates: action.payload };
    }
    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };

    case "ADD_NEW_GAME_SNAPSHOTS":
      console.log(state.newSnapshots);
      console.log("adding new game snapshot");
      // they should already be in the right order and the first snapshot should
      // have added transitionTemplates already---if there weren't already
      // others in the stack
      return { ...state, newSnapshots: state.newSnapshots.concat(action.payload) };

    case "ADD_SCREEN_DATA_TO_TEMPLATE": {
      let currTemplate = action.payload;
      if (isTemplateComplete(currTemplate)) {
        currTemplate = { ...currTemplate, status: "awaitingSimultaneousTemplates" };
      }
      const animationTemplates = updateTemplate(currTemplate, state.animationTemplates);
      return { ...state, animationTemplates };
    }
    // case "END_ANIMATION_TEMPLATE_NEW_VERSION": {
    case "REMOVE_ANIMATION": {
      const cardId = action.payload;

      const animationData = state.animationData.filter(ad => ad.cardId !== action.payload);

      let nextGroupIndex = -1;
      const animationTemplates = state.animationTemplates.map((group, index) => {
        if (index === nextGroupIndex) {
          return changeGroupStatus("awaitingEmissaryData", group);
        }
        return group.map(a => {
          if (a.from.cardId === cardId) {
            nextGroupIndex = index + 1;
            return { ...a, status: "complete" };
          }
          return a;
        });
      });

      return { ...state, animationData, animationTemplates };
    }
    

    case "CLEAR_ANIMATION_TEMPLATES": {
      return { ...state, animationTemplates: []};
    }
    case "ADD_TRANSITION":
      const newTransition = action.payload;
      return { ...state, transitionData: [...state.transitionData, newTransition] };
    case "ADD_MULTIPLE_TRANSITIONS":
      console.log("adding multiple transitions");
      console.log(action.payload);
      const newTransitions = action.payload;
      return { ...state, transitionData: [...state.transitionData, ...newTransitions] };
    case "ADD_MULTIPLE_ANIMATIONS_NEW_VERSION": {
      console.log(action.payload);
      const newAnimations = action.payload;
      const updatedTemplatesGroup = changeGroupStatus("underway", state.animationTemplates[0]);
      const animationTemplates = state.animationTemplates.map((t, i) => (i === 0 ? updatedTemplatesGroup : t));
      return { ...state, animationTemplates, animationData: [...state.animationData, ...newAnimations] };
    }
    case "ADD_ANIMATION":
      const newAnimation = action.payload;
      return { ...state, animationData: [...state.animationData, newAnimation] };
    case "ADD_MULTIPLE_ANIMATIONS":
      console.log("adding multiple animations");
      console.log(action.payload);
      const newAnimations = action.payload;
      return { ...state, animationData: [...state.animationData, ...newAnimations] };
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
