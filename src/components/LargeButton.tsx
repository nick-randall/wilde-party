import React from "react";
import styled from "styled-components";

const Button = styled.button`
  cursor: pointer;
  width: 300px;
  font-family: wilde-party-font;
  font-size: 30px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  background-color: white;
  color: #f9ca44;
  border: thin black solid;
  padding: 12px 15px 7px 15px;
`;

interface WildePartyButtonProps {
  onClick?: () => void;
  text?: string;
  link?: string;
}

const LargeButton: React.FC<WildePartyButtonProps> = ({ onClick, text, link }) => {
  if (link) {
    return (
      <a href={link} style={{ textDecoration: "none", color: "inherit" }}>
        <Button>{text}</Button>
      </a>
    );
  }
  return (
      <Button onClick={onClick}>{text}</Button>
  );
};

export default LargeButton;
