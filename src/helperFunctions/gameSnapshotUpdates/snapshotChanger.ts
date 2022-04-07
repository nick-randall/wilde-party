import { getCard, locate } from "../locateFunctions";
import { produce } from "immer";

export interface NewSnapshotChange {
  origin: LocationData;
  destination: LocationData;
}

interface SnapshotLocation {
  player: number | null;
  place: PlaceType;
  index: number;
}

interface SnapshotUpdate {
  origin: SnapshotLocation;
  destination: SnapshotLocation;
}

export default class SnapshotUpdater {
  private snapshot: GameSnapshot;

  private changes: NewSnapshotChange[] = [];

  private snapshotChanges: SnapshotUpdate[] = [];

  private newSnapshot: GameSnapshot;

  constructor(snapshot: GameSnapshot) {
    this.snapshot = { ...snapshot };
    this.newSnapshot = { ...snapshot };
  }

  public addChange(change: NewSnapshotChange) {
    const snapshotChange = this.convertToSnapshotChange(change);
    console.log(snapshotChange);
    this.snapshotChanges.push(snapshotChange);
  }

  public addChanges(changes: NewSnapshotChange[]) {
    const snapshotChanges = changes.map(change => this.convertToSnapshotChange(change));
    this.snapshotChanges.push(...snapshotChanges);
  }

  private convertToSnapshotChange(change: NewSnapshotChange): SnapshotUpdate {
    let origin: SnapshotLocation;
    let destination: SnapshotLocation;
    const { player: originPlayer, place: originPlace } = locate(change.origin.containerId, this.snapshot);
    origin = { player: originPlayer, place: originPlace, index: change.origin.index };
    const { player: destinationPlayer, place: destinationPlace } = locate(change.destination.containerId, this.snapshot);
    destination = { player: destinationPlayer, place: destinationPlace, index: change.destination.index };
    console.log(origin, destination);
    return { origin: origin, destination: destination };
  }

  public begin() {
    console.log(this.snapshotChanges);
    this.snapshotChanges.forEach(change => {
      console.log("iteration");
      this.newSnapshot = produce(this.snapshot, draft => {
        const { origin, destination } = change;
        const { player: originPlayer, place: originPlace, index: originIndex } = origin;

        let splicedCard;
        if (originPlayer !== null) {
          splicedCard = draft.players[originPlayer].places[originPlace].cards.splice(originIndex, 1);
        } else {
          splicedCard = draft.nonPlayerPlaces[originPlace].cards.splice(originIndex, 1);
        }

        const { player: destinationPlayer, place: destinationPlace, index: destinationIndex } = destination;
        if (destinationPlayer !== null) {
          draft.players[destinationPlayer].places[destinationPlace].cards.splice(destinationIndex, 0, ...splicedCard);
        } else {
          draft.nonPlayerPlaces[destinationPlace].cards.splice(destinationIndex, 0, ...splicedCard);
        }
      });
    });
  }
  public getSnapshot() {
    return this.snapshot;
  }
  public getNewSnapshot() {
    return this.newSnapshot;
  }
}
