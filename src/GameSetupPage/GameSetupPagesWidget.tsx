import { FC } from "react";

const GameSetupPagesWidget: FC<WidgetProps> = widgetData => {
  const { currIndex, index, widgetComponent } = widgetData;
  const offscreenLeft = 100 * (currIndex - index);
  return (
    // <div  style={{position:"absolute", transition: "all 1s", top: "50%", left:"50%" ,transform: `translate(calc(${-offscreenLeft}vw - 50%), -50%` }}>
    <div className="game-setup-widget" style={{ transform: `translate(calc(${-offscreenLeft}vw - 50%), -50%` }}>
      {widgetComponent}
    </div>
    // </div>
  );
};

export default GameSetupPagesWidget;
