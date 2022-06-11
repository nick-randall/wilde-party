import { locate } from "../locateFunctions";
import { produce } from "immer";

export default class SnapshotUpdater {
  private snapshot: GameSnapshot;

  private newSnapshot: GameSnapshot;

  private snapshotUpdate?: SnapshotUpdate;

  private snapshotUpdates: SnapshotUpdate[] = [];

  private numElements: number = 1;

  constructor(snapshot: GameSnapshot, snapshotUpdateType: SnapshotUpdateType) {
    this.snapshot = { ...snapshot };
    this.newSnapshot = { ...snapshot, snapshotUpdateType: snapshotUpdateType };
  }

  public addChange(change: DraggedResult) {
    this.snapshotUpdate = this.convertToSnapshotUpdate(change);
  }

  public addChanges(change: DraggedResult, numElements: number) {
    this.snapshotUpdate = this.convertToSnapshotUpdate(change);
    this.numElements = numElements;
  }

  public addChangesFromDifferentPlaces(changes: DraggedResult[]) {
    changes.forEach(change => {
      const newUpdate = this.convertToSnapshotUpdate(change);
      this.snapshotUpdates.push(newUpdate);
    });
  }

  private convertToSnapshotUpdate(change: DraggedResult): SnapshotUpdate {
    const draggedId = this.findDraggedId(change);

    const { source, destination } = change;
    let from: SnapshotLocation = this.convertSourceOrDestToToOrFrom(source);
    let to: SnapshotLocation = this.convertSourceOrDestToToOrFrom(destination);

    return { from: from, to: to };
  }

  private convertSourceOrDestToToOrFrom(sourceOrDest: DragDestinationData): SnapshotLocation {
    const { index, containerId } = sourceOrDest;
    const { player, place } = locate(containerId, this.snapshot);
    // const playerId = this.findPlayerId(sourceOrDest);
    return {
      player,
      place,
      // placeId: containerId,
      index,
      // playerId,
      // cardId: "",
    };
  }

  private findDraggedId(change: DraggedResult) {
    const { player, place } = locate(change.source.containerId);
    let draggedCard: GameCard;
    if (player === null) {
      draggedCard = this.snapshot.nonPlayerPlaces[place].cards[change.source.index];
    } else {
      draggedCard = this.snapshot.players[player].places[place].cards[change.source.index];
    }
    return draggedCard.id;
  }

  private findPlayerId(sourceOrDest: DragDestinationData) {
    const player = locate(sourceOrDest.containerId, this.snapshot).player;
    if (player !== null) return this.snapshot.players[player].id;
    return null;
  }

  public begin() {
    this.newSnapshot = produce(this.snapshot, draft => {
      draft.id++;
      if (this.snapshotUpdate !== undefined) {
        const { from, to } = this.snapshotUpdate;
        const { player: originPlayer, place: originPlace, index: originIndex } = from;

        let splicedCard;
        if (originPlayer !== null) {
          splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, this.numElements);
        } else {
          splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, 1);
        }

        const { player: destinationPlayer, place: destinationPlace, index: destIndex } = to;
        if (destinationPlayer !== null) {
          draft.players[destinationPlayer].places[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
        } else {
          draft.nonPlayerPlaces[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
        }
      } else if (this.snapshotUpdates.length > 0) {
        this.snapshotUpdates.forEach(update => {
          // this.newSnapshot = produce(this.snapshot, draft => {
          const { from, to } = update;
          const { player: originPlayer, place: originPlace, index: originIndex } = from;

          let splicedCard;
          if (originPlayer !== null) {
            splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, this.numElements);
          } else {
            splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, 1);
          }

          const { player: destinationPlayer, place: destinationPlace, index: destIndex } = to;
          if (destinationPlayer !== null) {
            draft.players[destinationPlayer].places[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
          } else {
            draft.nonPlayerPlaces[destinationPlace].cards.splice(destIndex, 0, ...splicedCard);
          }
        });
        // });
      }
    });
  }
  public getSnapshot() {
    return this.snapshot;
  }
  public getNewSnapshot() {
    return this.newSnapshot;
  }
}
