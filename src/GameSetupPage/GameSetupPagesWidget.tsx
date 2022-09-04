import { FC } from "react";

const GameSetupPagesWidget: FC<WidgetProps> = widgetData => {
  const { currIndex, index, widgetComponent } = widgetData;
  const offscreenLeft = 100 * (currIndex - index);
  return (
    <div className="game-setup-widget" style={{ transform: `translate(calc(${-offscreenLeft}vw - 50%), -50%` }}>
      {widgetComponent}
    </div>
  );
};

export default GameSetupPagesWidget;
