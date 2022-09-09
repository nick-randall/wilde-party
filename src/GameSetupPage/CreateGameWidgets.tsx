import { FC } from "react";

const SelectPlayers: FC<InnerWidgetProps> = ({ submit, atFinalIndex, setupData, setSetupData }) => {
  return (
    <div style={{ display: "flex", gap: "3ch" }}>
      <img src="../../images/avatars/roboty.png" alt="insert file name here" className="game-setup-avatar" />
      <img src="../../images/avatars/screamer_avatar.jpg" alt="insert file name here" className="game-setup-avatar center" />
      <img src="../../images/avatars/roboty.png" alt="insert file name here" className="game-setup-avatar" />
    </div>
  );
};
export default SelectPlayers;
