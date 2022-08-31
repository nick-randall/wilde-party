import { FC } from "react";


const GameSetupPagesWidget: FC<WidgetProps> = widgetData => {
  const { currIndex, index, widgetComponent } = widgetData;
  const offscreenLeft = 100 * (currIndex - index);
  return (
    <div className="wrapper" style={{ transform: `translateX(calc(${-offscreenLeft}vw - 50%)` }}>
      <div className="game-setup-widget">{widgetComponent}</div>
    </div>
  );
};

export default GameSetupPagesWidget;
