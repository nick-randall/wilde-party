import styled, { keyframes } from "styled-components";

const throb = keyframes`

  0% {
      -webkit-transform: scale(1.0, 1.0); opacity: 1.0;
  }
  50% {
      -webkit-transform: scale(0.75, 0.75); opacity: 0.5;
  }
  100% {
      -webkit-transform: scale(1.0, 1.0); opacity: 1.0;
  
}
`;


type OffscreenPosition = "top" | "bottom" | "";

const offScreenProp = {
  top: "translate(-50%, -50vh);",
  bottom: "translate(-50%, 50vh);",
  "": "translateX(-50%);",
};

type ButtonProps = {
  imageHeight?: number;
  wide?: boolean;
  disabled?: boolean;
  offScreen: OffscreenPosition;
};


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
  /*text-shadow: 4px 5px 0px black;*/
`;

