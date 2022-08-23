import { FC } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./css/GamePath.css";
import GameSetup from "./GameSetupPage/GameSetupPage";

interface GameProps {}

const Game: FC<GameProps> = () => {
  const location = useLocation();
  console.log(location.pathname)
  return (
    <div className="background">
     
      <Routes>
        <Route path="/setup/*" element={<GameSetup />} />
      </Routes>
    </div>
  );
};

export default Game;
