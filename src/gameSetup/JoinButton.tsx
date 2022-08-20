import { FC, forwardRef, Ref } from "react";
import { CSSProperties } from "styled-components";

interface JoinGameButtonProps {
  offScreen: boolean;
  joinGame: () => void;
}

const JoinGameButton: FC<JoinGameButtonProps> = forwardRef(({ offScreen, children, joinGame }, ref: Ref<HTMLDivElement>) => {
  const style: CSSProperties = {
    transform: offScreen ? "translate(-100vh)" : "",//"translateX(-50%)",

    // position: "absolute",
    height: "2ch",
    fontFamily: "wilde-party-font",
    fontSize: 20,
    borderRadius: 30,
    boxShadow: "4px 5px 0px black",
    backgroundColor: "white",
    padding: "20px 15px 10px 15px",
    transitionProperty: "transform",
    transitionDuration: "1000ms"
  };
  return <div style={style} onClick={joinGame} ref={ref}>{children}</div>;
});

export default JoinGameButton;
