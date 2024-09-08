import styled from "styled-components";

const Button = styled.button`
  cursor: pointer;
  font-family: wilde-party-font;
  font-size: 20px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  background-color: white;
  text-shadow: none;
  color: black;
  border: thin black solid;
  padding: 10px 10px 5px 10px;
`;

interface SmallButtonProps {
  onClick?: () => void;
  text?: string;
  link?: string;
}

const SmallButton: React.FC<SmallButtonProps> = ({ onClick, text, link }) => {
  if (link) {
    return (
      <a href={link} style={{ textDecoration: "none", color: "inherit" }}>
        <Button>{text}</Button>
      </a>
    );
  }
  return (
    <div onClick={onClick}>
      <Button>{text}</Button>
    </div>
  );
};

export default SmallButton;