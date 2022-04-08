import { getCard, locate } from "../locateFunctions";
import { produce } from "immer";

export interface NewSnapshotChange {
  source: LocationData;
  destination: LocationData;
}

interface SnapshotUpdate {
  source: SnapshotLocation;
  destination: SnapshotLocation;
}

export default class SnapshotUpdater {
  private snapshot: GameSnapshot;

  private newSnapshot: GameSnapshot;

  private snapshotChange?: SnapshotUpdate;

  private numElements: number = 1;

  constructor(snapshot: GameSnapshot) {
    this.snapshot = { ...snapshot };
    this.newSnapshot = { ...snapshot };
  }

  public addChange(change: DraggedResult/*change: NewSnapshotChange*/) {
    this.snapshotChange = this.convertToSnapshotChange(change);
  }

  public addChanges(change: NewSnapshotChange, numElements: number) {
    this.snapshotChange = this.convertToSnapshotChange(change);
    this.numElements = numElements;
  }

  private convertToSnapshotChange(change: NewSnapshotChange): SnapshotUpdate {
    let source: SnapshotLocation;
    let destination: SnapshotLocation;
    const { player: originPlayer, place: originPlace } = locate(change.source.containerId, this.snapshot);
    source = { player: originPlayer, place: originPlace, index: change.source.index };
    const { player: destinationPlayer, place: destinationPlace } = locate(change.destination.containerId, this.snapshot);
    destination = { player: destinationPlayer, place: destinationPlace, index: change.destination.index };
    console.log(source, destination);
    return { source: source, destination: destination };
  }

  public begin() {
    this.newSnapshot = produce(this.snapshot, draft => {
      if (this.snapshotChange !== undefined) {
        const { source, destination } = this.snapshotChange;
        const { player: originPlayer, place: originPlace, index: originIndex } = source;

        let splicedCard;
        if (originPlayer !== null) {
          splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, this.numElements);
        } else {
          splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, 1);
        }

        const { player: destinationPlayer, place: destinationPlace, index: destinationIndex } = destination;
        if (destinationPlayer !== null) {
          draft.players[destinationPlayer].places[destinationPlace].cards.splice(destinationIndex, 0, ...splicedCard);
        } else {
          draft.nonPlayerPlaces[destinationPlace].cards.splice(destinationIndex, 0, ...splicedCard);
        }
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
