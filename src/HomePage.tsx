import { Link } from "react-router-dom";
import styled, { StyledComponent } from "styled-components";

type GameStartedProps = {
  imageHeight?: number;
};

const HomeScreenButton = styled.div<GameStartedProps>`
  height: 40px;
  width: 300px;
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
  /*text-shadow: 4px 5px 0px black;*/
`;


const HomePage: React.FC = () => {
  return (
    <div>
      <img
        src="./images/splashscreen.jpg"
        alt="background"
        style={{
          width: "100vw",
          transition: "1600ms",
          overflow: "hidden",
          padding: 0,
          position: "fixed",
        }}
      />
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: "45vh" }} />
          <Link to="/game">
            <HomeScreenButton>Spiel starten</HomeScreenButton>
          </Link>
          <div style={{ height: 10 }} />
          <HomeScreenButton imageHeight={30}>
            <a href="https://github.com/nick-randall/wilde-party" target="_self">
              <img src="https://www.analyticsvidhya.com/wp-content/uploads/2015/07/github_logo.png" alt="github logo" style={{ height: 35 }} />
            </a>
          </HomeScreenButton>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default HomePage;
