import { FC } from "react";
import { useLocation } from "react-router-dom";
import GameSetupPagesWidget, { WidgetData } from "./GameSetupWidgets";

interface JoinGamePageProps {
  index: number;
  widgetsData: WidgetData[]
}



const JoinGamePage: FC<JoinGamePageProps> = ({ index, widgetsData }) => {
  const location = useLocation();
  console.log("join game page " + index)
  return (
    <div style={{ gridRow: 1 }}>
      {widgetsData.map((widget) => (
        <GameSetupPagesWidget {...widget} currIndex={index} numWidgets={widgetsData.length}>
          {widget.widgetComponent}
        </GameSetupPagesWidget>
      ))}
    </div>
  );
};

export default JoinGamePage;
