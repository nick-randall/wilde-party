import { locatePlace, LocationInfo } from "../locateFunctions";
import { produce } from "immer";
import locatePlayer from "../locateFunctions/locatePlayer";

export type Change = {
  source: DragSourceData;
  destination: DragDestinationData;
}

type DragDestinationData = {
  placeId: number;
  index: number;
}

 type DragSourceData = {
  placeId: number;
  index: number;
  numDraggedElements: number
}

interface SnapshotChange {
  origin: LocationInfo;
  destination: LocationInfo;
}

export default class SnapshotUpdater {

  
  private snapshot: GameSnapshot;

  private newSnapshot: GameSnapshot;

  private snapshotUpdate?: SnapshotChange;

  private snapshotUpdates: SnapshotChange[] = [];

  private numElements: number = 1;

  constructor(snapshot: GameSnapshot, snapshotUpdateData: SnapshotUpdateData) {
    // this.snapshot = { ...snapshot, snapshotUpdateData: {type: snapshotUpdateType} };
    // this.newSnapshot = { ...snapshot, snapshotUpdateType: snapshotUpdateType };
    this.snapshot = { ...snapshot };
    this.newSnapshot = { ...snapshot, snapshotUpdateData, index: snapshot.index + 1 };
  }

  public setSnapshotUpdateData(snapshotUpdateData: SnapshotUpdateData) {
    this.snapshot = { ...this.snapshot, snapshotUpdateData };
    this.newSnapshot = { ...this.newSnapshot, snapshotUpdateData };
  }

  public addChange(change: Change) {
    this.snapshotUpdate = this.convertToSnapshotUpdate(change);
  }

  public addChangeWithMultipleCards(change: Change, numElements: number) {
    this.snapshotUpdate = this.convertToSnapshotUpdate(change);
    this.numElements = numElements;
  }

  public addChangesFromDifferentPlaces(changes: Change[]) {
    changes.forEach(change => {
      const newUpdate = this.convertToSnapshotUpdate(change);
      this.snapshotUpdates.push(newUpdate);
    });
  }

  private convertToSnapshotUpdate(change: Change): SnapshotChange {
    const draggedId = this.findDraggedId(change);

    const { source, destination } = change;
    let from: LocationInfo = this.convertSourceOrDestToToOrFrom(source);
    let to: LocationInfo = this.convertSourceOrDestToToOrFrom(destination);

    return { origin: from, destination: to };
  }

  private convertSourceOrDestToToOrFrom(sourceOrDest: DragDestinationData): LocationInfo {
    const { index, placeId } = sourceOrDest;
    const { player, placeType } = locatePlace(placeId, this.snapshot);
    return {
      player,
      placeType,
      index,
    };
  }

  private findDraggedId(change: Change) {
    const { player, placeType } = locatePlace(change.source.placeId, this.snapshot);
    let draggedCard: GameCard;
    if (player === null) {
      draggedCard = this.snapshot.nonPlayerPlaces[placeType].cards[change.source.index];
    } else {
      draggedCard = this.snapshot.players[player].places[placeType].cards[change.source.index];
    }
    return draggedCard.id;
  }

  private findPlayerId(sourceOrDest: DragDestinationData) {
    const player = locatePlayer(sourceOrDest.placeId, this.snapshot);
    if (player !== null) return this.snapshot.players[player].id;
    return null;
  }

  public begin() {
    this.newSnapshot = produce(this.snapshot, draft => {
      draft.index++;
      // draft.id++;
      if (this.snapshotUpdate !== undefined) {
        const { origin, destination } = this.snapshotUpdate;
        const { player: originPlayer, placeType: originPlace, index: originIndex } = origin;

        let splicedCard;
        if (originPlayer !== null) {
          splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, this.numElements);
        } else {
          splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, this.numElements);
        }
        const { player: destinationPlayer, placeType: destinationPlace, index: destIndex } = destination;
        if (destinationPlayer !== null) {
          draft.players[destinationPlayer].places[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
        } else {
          draft.nonPlayerPlaces[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
        }
      } else if (this.snapshotUpdates.length > 0) {
        this.snapshotUpdates.forEach(update => {
          const { origin, destination } = update;
          const { player: originPlayer, placeType: originPlace, index: originIndex } = origin;

          let splicedCard;
          if (originPlayer !== null) {
            splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, this.numElements);
          } else {
            splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, this.numElements);
          }

          const { player: destinationPlayer, placeType: destinationPlace, index: destIndex } = destination;
          if (destinationPlayer !== null) {
            draft.players[destinationPlayer].places[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
          } else {
            draft.nonPlayerPlaces[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
          }
        });
      }
    });
  }
  public getSnapshot() {
    return this.snapshot;
  }
  public getNewSnapshot() {
    return this.newSnapshot;
  }
  // public setPhase(phase: Phase) {
  //   this.newSnapshot = {
  //     ...this.newSnapshot,
  //     current: { ...this.newSnapshot.current, phase },
  //   };
  // }
}
