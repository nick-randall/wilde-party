import { FC } from "react";

const SelectPlayers: FC<InnerWidgetProps> = ({ submit, atFinalIndex, setupData, setSetupData }) => {
  return (
    <div style={{ display: "flex", gap: "3ch" }}>
      <img src="../../images/avatars/robot.png" alt="insert file name here" className="game-setup-avatar" />
      <img src="../../images/avatars/screamer_avatar.jpg" alt="insert file name here" className="game-setup-avatar center" onClick={() => submit()} />
      <div>
        <img src="../../images/avatars/robot.png" alt="insert file name here" className="game-setup-avatar" />
      </div>
    </div>
  );
};
export default SelectPlayers;
