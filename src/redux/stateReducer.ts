import { getHighlights } from "../helperFunctions/gameRules/gatherHighlights";
import { locate } from "../helperFunctions/locateFunctions/locateFunctions";
import { Action } from "./actions";
import { produce } from "immer";
import { createGameSnapshot } from "../createGameSnapshot/createGameSnapshot";
import { changeGroupStatus } from "../animations/handleEndAnimation";
import { initDevSettings } from "../gameSettings/devSettings";
import { createKeyframesFromTemplate } from "../animations/createKeyframesFromTemplate";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
  const currentPlayer = gameSnapshot.current.player;
  const numPlayers = gameSnapshot.players.length;
  return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

const isTemplateComplete = (currTemplate: AnimationTemplate) => {
  const toandFromComplete = currTemplate.to.dx !== undefined && currTemplate.from.dx !== undefined;
  if ("via" in currTemplate) {
    const viaComplete = currTemplate.via?.dx !== undefined;
    return toandFromComplete && viaComplete;
  } else return toandFromComplete;
};

const updateTemplate = (template: AnimationTemplate, array: AnimationTemplate[][]) =>
  array.map(group => group.map(t => (t.id === template.id ? template : t)));

export interface State {
  gameSnapshot: GameSnapshot;
  newSnapshots: GameSnapshot[];
  draggedState: DraggedState;
  dragEndTarget?: DragEndTarget;
  devSettings: DevSettings;
  dragContainerExpand: { width: number; height: number };
  screenSize: { width: number; height: number };
  animationData: AnimationData[];
  animationTemplates: AnimationTemplate[][];
  transitionData: TransitionData[];
  BFFdraggedOverSide?: string;
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
    screenSize: getScreenSize(),
    devSettings: initDevSettings,
    dragContainerExpand: initialDragState.dragContainerExpand,
    draggedState: initialDragState.draggedState,
    dragEndTarget: initialDragState.dragEndTarget,
    animationData: [],
    animationTemplates: [],
    BFFdraggedOverSide: undefined,
    transitionData: [],
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
    case "TOGGLE_DEV_SETTING": {
      const id = action.payload;
      const devSettings = { ...state.devSettings, [id]: { name: initDevSettings.id.name, on: !id.on } };
      return { ...state, devSettings };
    }
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
    case "SET_NEW_SNAPSHOTS": {
      const newSnapshots: GameSnapshot[] = action.payload;
      const sortedNewSnapshots = newSnapshots.sort((a, b) => a.id - b.id);
      console.log("setting new snapshots");
      return { ...state, newSnapshots: sortedNewSnapshots };
    }
    case "ADD_NEW_GAME_SNAPSHOTS":
      console.log(state.newSnapshots);
      console.log("adding new game snapshot");
      console.log(action.payload);
      // they should already be in the right order and the first snapshot should
      // have added transitionTemplates already---if there weren't already
      // others in the stack
      return { ...state, newSnapshotsVersion: state.newSnapshots.concat(action.payload) };

    case "OVERWRITE_CURRENT_SNAPSHOT": {
      const newSnapshots = state.newSnapshots.filter((a, i) => i > 0);
      return { ...state, newSnapshots, gameSnapshot: action.payload };
    }
    case "SET_ANIMATION_TEMPLATES": {
      console.log("setting these animation templates");
      console.log(action.payload);
      return { ...state, animationTemplates: action.payload };
    }
    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };

    case "ADD_SCREEN_DATA_TO_TEMPLATE": {
      let currTemplate = action.payload;
      if (isTemplateComplete(currTemplate)) {
        currTemplate = { ...currTemplate, status: "awaitingSimultaneousTemplates" };
      }
      const animationTemplates = state.animationTemplates.map(group => group.map(t => (t.id === currTemplate.id ? currTemplate : t))); //updateTemplate(currTemplate, state.animationTemplates);
      return { ...state, animationTemplates };
    }
    case "REMOVE_ANIMATION": {
      const cardId = action.payload;

      const animationData = state.animationData.filter(ad => ad.cardId !== action.payload);

      let nextGroupIndex = -1;
      const animationTemplates = state.animationTemplates.map((animationTemplateGroup, index) => {
        // identify the "next in line" animationTemplateGroup to be updated after previous animationTemplateGroup is set to "complete"
        if (index === nextGroupIndex) {
          return changeGroupStatus("awaitingEmissaryData", animationTemplateGroup);
        }
        return animationTemplateGroup.map(a => {
          if (a.cardId === cardId) {
            // set the animationTemplateGroup to "complete"
            nextGroupIndex = index + 1;
            return { ...a, status: "complete" };
          }
          return a;
        });
      });

      return { ...state, animationData, animationTemplates };
    }

    case "CLEAR_ANIMATION_TEMPLATES": {
      return { ...state, animationTemplates: [] };
    }
    // Called after all templates for the group have received their screen data (all are "awaitingSimultaneousTemplates")
    case "ADD_MULTIPLE_ANIMATIONS": {
      console.log(action.payload);
      const newAnimations = action.payload;
      const updatedTemplatesGroup = changeGroupStatus("underway", state.animationTemplates[0]);
      const animationTemplates = state.animationTemplates.map((t, i) => (i === 0 ? updatedTemplatesGroup : t));
      console.log(animationTemplates);
      return { ...state, animationTemplates, animationData: [...state.animationData, ...newAnimations] };
    }
    case "CREATE_ANIMATIONS_FROM_TEMPLATES": {
      console.log("new animation templates ready");
      const currTemplates: CompleteAnimationTemplate[] = action.payload;
      const newAnimations = currTemplates.map(t => createKeyframesFromTemplate(t));
      const animationTemplates = state.animationTemplates.map(group =>
        group.map(t => t.id).includes(currTemplates[0].id) ? changeGroupStatus("underway", group) : group
      );
      console.log(newAnimations);
      console.log(animationTemplates);
      return { ...state, animationTemplates, animationData: [...state.animationData, ...newAnimations] };
    }
    case "ADD_ANIMATION":
      const newAnimation = action.payload;
      return { ...state, animationData: [...state.animationData, newAnimation] };
    case "SET_HIGHLIGHTS": {
      // if(!phaseNormalTurnIsYours) return state;
      const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
      if (draggedHandCard) {
        const highlights = getHighlights(draggedHandCard, state.gameSnapshot);
        const highlightType = draggedHandCard.action.highlightType;
        return { ...state, highlights, highlightType };
      } else return state;
    }
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
