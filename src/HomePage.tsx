import { Link } from "react-router-dom";
import styled from "styled-components";

  type GameStartedProps = {
    offsetTop?: number
  }

  const SplashScreenButton = styled.div<GameStartedProps>`
  height: 80px;
  width: 400px;
  font-family: wilde-party-font;
  font-size: 30px;
  border-radius: 30px;
  box-shadow: 10px 10px 25px black;
  background-color: white;
  color: black;
  position: absolute;
  transform: translateX(-50%);
  top: ${props => (props.offsetTop ? props.offsetTop : "")}px;
`;



const HomePage: React.FC = () => {
  // const onStart = () => {
  //   setGameStarted(true);
  //   setTimeout(() => {
  //     dispatch(dealInitialHands());
  //   }, 1800);
  // };
  // useEffect(()=>{
  //   if(!gameStarted) {
  //     console.log("called it")
  //     dispatch(dealInitialHands());
  //   setGameStarted(true);
  //   }

  // }, [gameStarted, dispatch])



  return (
    <div>
      {" "}
      <img
        src="./images/splashscreen.jpg"
        alt="background"
        style={{
          width: "100vw",
          transition: "1600ms",
          overflow: "hidden",
          padding: 0,
          backgroundColor: "blue",
          position: "fixed",
        }}
      />
      
      <div style={{ display: "block", position: "absolute", top: "50vh", marginLeft: "50%", marginRight: "50%" }}>
      <Link to="/game">
        <SplashScreenButton >
        
          <div style={{ position: "relative", textAlign: "center", top: "50%", transform: "translateY(-50%)" }}>Spiel starten</div>
          
        </SplashScreenButton>
        </Link>
        <SplashScreenButton  offsetTop={100}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a
              href="https://github.com/nick-randall/wilde-party"
              target="_self"
              style={{
                display: "flex",
                justifyContent: "center",
                verticalAlign: "middle",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <img src="https://www.analyticsvidhya.com/wp-content/uploads/2015/07/github_logo.png" alt="github logo" style={{ height: 40 }} />
            </a>
          </div>
        </SplashScreenButton>
      </div>
    </div>
  );
};

export default HomePage;
