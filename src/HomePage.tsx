import { url } from "inspector";
import { Link } from "react-router-dom";
import styled, { StyledComponent } from "styled-components";
import "animate.css";
import { useState } from "react";

type GameStartedProps = {
  imageHeight?: number;
  wide?: boolean;
};

type Choice = "startNewGame" | "joinGame" | "";

const HomeScreenButton = styled.div<GameStartedProps>`
  // height: 40px;
  width: ${props => (props.wide ? "30ch" : "15ch")};
  font-family: wilde-party-font;
  font-size: 35px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  background-color: white;
  color: #f9ca44;
  border: thin black solid;
  padding: ${props => (props.imageHeight ? "12.5px 15px 12.5px 15px" : "20px 15px 10px 15px")};
  text-align: center;
  display: inline-block;
  cursor: pointer;
  /*text-shadow: 4px 5px 0px black;*/
`;

const HomePage: React.FC = () => {
  const [bannerOffScreen, setBannerOffScreen] = useState(false);
  const [choice, setChoice] = useState<Choice>("");

  const slideBanner = () => setBannerOffScreen(state => !state);
  const chooseStartNewGame = () => {
    setChoice("startNewGame")
  }
  const chooseJoinGame = () => {
    setChoice("joinGame")

  }

  return (
    <div className="full-height">
      <div className="screen-behind horizontal-flex-container full-height">
        <div className="vertical-container">
          {/* <img className="test" src="./images/beerpong.jpg" alt="test" /> */}
          <div className={`vertical-container justify-content-end flying-button ${choice === "joinGame" ? "off-screen-top" : ""}`}>
            <HomeScreenButton  onClick={chooseStartNewGame}>
              Neue Party starten
            </HomeScreenButton>
          </div>
          <div className={`vertical-container justify-content-start flying-button ${choice === "startNewGame" ? "off-screen-bottom" : ""}`}>
            <HomeScreenButton onClick={chooseJoinGame}>Zur Party einer Freund*in</HomeScreenButton>
          </div>
        </div>
      </div>

      <div
        className={`banner full-height ${bannerOffScreen ? "off-screen" : ""}`}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `url("./images/splashscreen.jpg")`,
          backgroundSize: "cover",
          transition: "3s",
        }}
      >
        <div className="vertical-container">
          <div style={{ height: "10vh" }} />
          {/* <Link to="/game"> */}
          <HomeScreenButton className={!bannerOffScreen ? "animate__animated animate__pulse animate__infinite" : ""} onClick={slideBanner}>
            starten
          </HomeScreenButton>
          {/* </Link> */}

          {/* <div style={{ height: 10 }} /> */}
          {/* <HomeScreenButton imageHeight={30}>
          <a href="https://github.com/nick-randall/wilde-party" target="_self">
            <img src="https://www.analyticsvidhya.com/wp-content/uploads/2015/07/github_logo.png" alt="github logo" style={{ height: 35 }} />
          </a>
        </HomeScreenButton> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
