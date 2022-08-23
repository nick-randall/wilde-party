import { FC } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Link } from "react-router-dom";
import Game from "./GamePath";
import "./css/global.css"

/**
 * By nesting the app inside a router, we get the location object
 */
interface AppProps {}

const App: FC<AppProps> = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      <div className={`banner ${location.pathname === "/" ? "" : "off-screen"}`}>
        <div className={`button pulsing`}>
          <Link to="/game/setup">starten</Link>
        </div>
      </div>
      <Routes>
        <Route path="/game/*" element={<Game />} />
      </Routes>
    </>
  );
};

export default App;
