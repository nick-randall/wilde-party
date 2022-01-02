import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import styled from 'styled-components'
import { getLayout } from "./dimensions/getLayout";
import { RootState } from "./redux/store";

interface PlayerProps {
  player: GamePlayer;
}

const Avatar = styled.img`
height: 100px;
width: 100px
`



const Player = (props: PlayerProps) => {
  const { player } = props;
  const { id, name, current, currentPhase, draws, plays, rolls, places, glitzaglitza, skipNextTurn } = player;
  const screenSize = useSelector((state: RootState) => state.screenSize)
  
  const {x, y} = getLayout(id, screenSize);
  console.log(x, y)
  console.log(id)
  return (
    <div style={{left: x, top: y, position:"absolute"}}>
    <Droppable droppableId={id}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <Avatar src="./images/player_avatar.png" alt="you" />
        </div>
      )}
    </Droppable>
    </div>
  );
};

export default Player;
