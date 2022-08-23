import { ChangeEvent, FC } from "react";
import "./GameSetupPages.css";
export type WidgetData = {
  index: number;
  buttonText: string;
  buttonFunction: Function;
  widgetComponent: JSX.Element;
};

const activeGames: GameStats[] = [{ name: "james 30th" }, { name: "steves 25th" }];

export const ActiveGames: FC<ActiveGamesProps> = ({ selectedParty, setSelected }) => {
  return (
    <>
      {activeGames.map(game => (
        <div onClick={() => setSelected(game)}>{game.name}</div>
      ))}
    </>
  );
};

type ActiveGamesProps = {
  selectedParty?: GameStats;
  setSelected: (game: GameStats) => void;
};

export type GameStats = {
  name: string;
};
type TextInputProps = {
  state: string;
  setStateFunction: (ev: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput: FC<TextInputProps> = ({ state, setStateFunction }) => {
  return (
    <>
      <div className="name-input-box">
        <p>Enter your name</p>
        <input className="name-input" type="text" value={state} onChange={setStateFunction} />{" "}
      </div>
    </>
  );
};

export const WaitingWidget: FC = () => {
  return (
    <>
      <p>Doing fancy api call stuff...</p>
    </>
  );
};
type WidgetProps = WidgetData & {
  numWidgets: number;
  children: JSX.Element;
  currIndex: number;
};

const GameSetupPagesWidget: FC<WidgetProps> = widgetData => {
  const { numWidgets, currIndex, index, widgetComponent } = widgetData;
  const offscreenLeft = 100 * (currIndex - index);

  return (
    <div className="game-setup-widget" style={{ gridRow: 2, transform: `translateX(calc(${offscreenLeft}vw - 50%)` }}>
      {widgetComponent}
    </div>
  );
};

export default GameSetupPagesWidget;
