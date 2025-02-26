import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { locateCard, locatePlace } from "../helperFunctions/locateFunctions";

const getScreenSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const nextPlayer = (gameSnapshot: GameSnapshot) => {
    const currentPlayer = gameSnapshot.current.player;
    const numPlayers = gameSnapshot.players.length;
    return currentPlayer < numPlayers - 1 ? currentPlayer + 1 : 0;
};

export interface DragEventState {
    // gameSnapshot: GameSnapshot;
    screenSize: { width: number; height: number };
    // transitionData: TransitionData[];
    draggedOver?: DroppableData;
    BFFdraggedOverSide?: string;
    rearrangingData: SimpleRearrangingData;
    draggedHandCard?: GameCard;
    draggableData?: DraggableData;
    highlights: number[];
    highlightType: string;
    // aiPlaying: string;
}

const isGCZ = (placeId: number, gameSnapshot: GameSnapshot) =>
    locatePlace(placeId, gameSnapshot).placeType === "guestCardZone";

const isSpecialsZone = (type: DroppableEntityType, placeId: number, gameSnapshot: GameSnapshot) => {
    if (type !== "place") return false;
    return locatePlace(placeId, gameSnapshot).placeType === "specialsZone";
};

const isSpecialsColumn = (type: DroppableEntityType, id: number, gameSnapshot: GameSnapshot) => {
    if (type !== "cardGroup") return false;
    return locateCard(id, gameSnapshot).placeType === "specialsZone";
};

const isEnchantWithBFF = (handCard: GameCard | undefined) => handCard?.cardType === "bff";

export interface DragEventState {
    // gameSnapshot: GameSnapshot;
    screenSize: { width: number; height: number };
    // transitionData: TransitionData[];
    draggedOver?: DroppableData;
    BFFdraggedOverSide?: string;
    rearrangingData: SimpleRearrangingData;
    draggedHandCard?: GameCard;
    droppableData?: DroppableData;
    highlights: number[];
    highlightType: string;
}

const initialState: DragEventState = {
    // gameSnapshot: emptyGameSnapshot,
    screenSize: getScreenSize(),
    draggedOver: undefined,
    BFFdraggedOverSide: undefined,
    droppableData: undefined,
    // transitionData: [],
    rearrangingData: { placeId: -1, draggedId: -1, sourceIndex: -1 },
    draggedHandCard: undefined,
    highlights: [],
    highlightType: "",
};

const getHighlights = (
    draggedHandCard: GameCard,
    actionResultsMap: { [key: number]: CardActionResult[] }
) => {
    const actionResults = actionResultsMap[draggedHandCard.id];
    return actionResults.map((res) => res.targetId);
};

export const dragEventSlice = createSlice({
    name: "dragEventState",
    initialState,
    reducers: {
        SET_SCREEN_SIZE: (state) => {
            state.screenSize = getScreenSize();
        },
        // Necessary in "onBeforeCapture" phase of dragging so that size of dragged card can
        // be altered
        SET_DRAGGED_HAND_CARD: (
            state,
            action: PayloadAction<{ draggedCardId: string; gameSnapshot: GameSnapshot }>
        ) => {
            const draggableId = action.payload.draggedCardId;
            const { gameSnapshot } = action.payload;
            if (!draggableId) {
                state.draggedHandCard = undefined;
                return;
            }
            const { id } = JSON.parse(draggableId);
            state.draggedHandCard = gameSnapshot.players[0].places.hand.cards.find(
                (e) => e.id === id
            );
        },
        SET_DRAGGABLE_DATA: (state, action: PayloadAction<DroppableData>) => {
            console.log(action.payload);
            state.droppableData = action.payload;
        },
        START_REARRANGING: (state, action: PayloadAction<SimpleRearrangingData>) => {
            console.log(action.payload);
            state.rearrangingData = action.payload;
        },
        SET_HIGHLIGHTS: (state, action: PayloadAction<GameSnapshot>) => {
            // if(!phaseNormalTurnIsYours) return state;
            const gameSnapshot = action.payload;
            const { actionResultsMap } = gameSnapshot;
            const draggedHandCard = state.draggedHandCard; //getDraggedHandCard(state, draggableId);
            if (draggedHandCard) {
                const actionResults = actionResultsMap[draggedHandCard.id];
                const legalTargetIds = actionResults.map((ar) => ar.snapshotUpdateData.targetId);
                if (legalTargetIds.length > 0) {
                    state.highlights = legalTargetIds;
                    state.highlightType = actionResults[0].targetType;
                }
            }
        },
        UPDATE_DRAGGED_OVER: (
            state,
            action: PayloadAction<{
                draggedOverData: DroppableData | undefined;
                gameSnapshot: GameSnapshot;
            }>
        ) => {
            const { gameSnapshot, draggedOverData } = action.payload;
            console.log(`UPDATE_DRAGGED_OVER`);
            if (!action.payload.draggedOverData) {
                console.log("No dragged over data");
                state.draggedOver = undefined;
                return;
            }
            const data = draggedOverData as DroppableData;
            const { id, index, type } = data;
            if (type === "place") {
                const placeName = locatePlace(id, gameSnapshot).placeType;
                console.log(`Dragged over ${placeName}: (id ${id}) at calculated index: ${index}`);

                if (isEnchantWithBFF(state.draggedHandCard)) {
                    // TODO replace with logic based on cardGroups
                    const neighbours = draggedOverData?.enchantableNeighbours;
                    if (neighbours && neighbours.includes("left")) {
                        state.BFFdraggedOverSide = "left";
                    } else if (neighbours && neighbours.includes("right")) {
                        state.BFFdraggedOverSide = "right";
                    }
                    state.draggedOver = data;
                }
                if (isSpecialsColumn(type, id, gameSnapshot)) {
                    console.log(`Dragged over specials column at calculated index: ${index}`);
                    /// TODO not sure why we set it to 0 here
                    state.draggedOver = { type, id, index: 0 };
                }
                state.draggedOver = data;
            } else if (type === "player") {
                console.log(`Dragged over player ${id}`);
                state.draggedOver = data;
            } else if (type === "cardGroup") {
                console.log(`Dragged over cardGroup ${draggedOverData?.id}`);
                state.draggedOver = data;
            }
        },
        // SET_GAME_SNAPSHOT: (state, action: PayloadAction<GameSnapshot>) => {
        //   console.log("Setting game snapshot");
        //   state.gameSnapshot = action.payload;
        // },
        // REARRANGE: (state, action: PayloadAction<{ source: DraggedOverData; destination: DraggedOverData }>) => {
        //   const { source, destination } = action.payload;
        //   if (isGCZ(source.id, state.gameSnapshot)) {
        //     state.gameSnapshot = rearrangeGCZ(state.gameSnapshot, source.index, destination.index);
        //   } else if (isSpecialsZone(source.type, source.id, state.gameSnapshot)) {
        //     state.gameSnapshot = rearrangeSpecialsZone(state.gameSnapshot, source.index, destination.index);
        //   }
        // },

        END_DRAG_CLEANUP: (state) => {
            console.log("Clean up!");
            const rearrangingData: SimpleRearrangingData = {
                placeId: -1,
                draggedId: -1,
                sourceIndex: -1,
            };
            return {
                ...state,
                draggedHandCard: undefined,
                DroppableData: undefined,
                highlights: [],
                highlightType: "",
                draggedOver: undefined,
                BFFdraggedOverSide: undefined,
                rearrangingData,
            };
            // case "ADD_TRANSITION":
            //   return { ...state, transitionData: [...state.transitionData, action.payload] };
            // case "REMOVE_TRANSITION":
            //   const transitionData = state.transitionData.filter(td => td.cardId !== action.payload);
            //   return { ...state, transitionData };
        },
    },
});

export default dragEventSlice.reducer;

export const {
    SET_SCREEN_SIZE,
    SET_DRAGGED_HAND_CARD,
    SET_DRAGGABLE_DATA,
    START_REARRANGING,
    SET_HIGHLIGHTS,
    UPDATE_DRAGGED_OVER,
    // SET_GAME_SNAPSHOT,
    // REARRANGE,
    END_DRAG_CLEANUP,
} = dragEventSlice.actions;
