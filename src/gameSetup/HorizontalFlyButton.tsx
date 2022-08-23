import styled, { css, CSSProperties, keyframes } from "styled-components";

const Throb = keyframes`

  0% {
      -webkit-transform: translate(-50%) scale(1.0, 1.0);
  }
  50% {
      -webkit-transform: translate(-50%) scale(0.95, 0.95);
  }
  100% {
      -webkit-transform: translate(-50%) scale(1.0, 1.0);
  
}
`;

type OffscreenPosition = "top" | "bottom" | "";

const offScreenProp = {
  top: "translate(-50%, -50vh);",
  bottom: "translate(-50%, 50vh);",
  "": "translateX(-50%);",
};

const offScreenPropForJoinButton = {
  top: "translateY(-50vh);",
  bottom: "translateY(50vh);",
  "": "",
};

type ButtonProps = {
  imageHeight?: number;
  wide?: boolean;
  disabled?: boolean;
  offScreen: OffscreenPosition;
  throb?: boolean;
};

const throbAnimation = (props: CSSProperties) => css`
${Throb} ${props.animationPlayState} infinite 1s;
`



export const HorizontalFlyButton = styled.div<ButtonProps>`
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

  transition: 1s;
  left: 50vw;
  transform: ${props => offScreenProp[props.offScreen]}
  position: absolute;
  cursor: ${props => (props.disabled ? "auto" : "pointer")};
  animation: ${props => throbAnimation({animationPlayState: props.throb ? "running" :  "initial"})};
  /*text-shadow: 4px 5px 0px black;*/
`;
