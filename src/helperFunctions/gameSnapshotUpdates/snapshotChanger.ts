import { getCard, locate } from "../locateFunctions";
import { produce } from "immer";

interface Change {
  origin: LocationData;
  destination: LocationData;
}

interface SnapshotLocation {
  player: number | null;
  place: PlaceType;
  index: number;
}

interface SnapshotChange {
  origin: SnapshotLocation;
  destination: SnapshotLocation;
}

export default class SnapshotChanger {
  private snapshot: GameSnapshot;

  private changes: Change[] = [];

  private snapshotChanges: SnapshotChange[] = [];

  constructor(snapshot: GameSnapshot) {
    this.snapshot = { ...snapshot };
  }

  public addChange(change: Change) {
    const snapshotChange = this.convertToSnapshotChange(change);
    this.snapshotChanges.push(snapshotChange);
  }

  public addChanges(changes: Change[]) {
    const snapshotChanges = changes.map(change => this.convertToSnapshotChange(change));
    this.snapshotChanges.push(...snapshotChanges);
  }

  private convertToSnapshotChange(change: Change): SnapshotChange {
    let origin: SnapshotLocation;
    let destination: SnapshotLocation;
    const { player: originPlayer, place: originPlace } = locate(change.origin.droppableId, this.snapshot);
    origin = { player: originPlayer, place: originPlace, index: change.origin.index };
    const { player: destinationPlayer, place: destinationPlace } = locate(change.destination.droppableId, this.snapshot);
    destination = { player: destinationPlayer, place: destinationPlace, index: change.origin.index };
    return { origin: origin, destination: destination };
  }

  public begin() {
    this.snapshotChanges.forEach(change =>
      produce(this.snapshot, draft => {
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
      })
    );
  }
  public getSnapshot() {
    return this.snapshot;
  }
}
