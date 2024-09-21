import styled from "styled-components";
import { ReactComponent as Icon } from "./send.svg";

const StyledIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  cursor: pointer;
  fill: palevioletred;
  &:hover {
    fill: #f9ca44;
  }
`;

const SizedBox = styled.div`
  width: 40px;
  height: 40px;
`;

const SendIcon: React.FC<{ onClick: (e: React.FormEvent) => void }> = ({ onClick }) => {
  return (
    <SizedBox>
      <StyledIcon onClick={onClick} />
    </SizedBox>
  );
};

export default SendIcon;
