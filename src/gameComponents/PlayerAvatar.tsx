import { Droppable } from "react-beautiful-dnd";
import styled from 'styled-components'

interface PlayerProps {
  player: GamePlayer;
}

const Avatar = styled.img`
height: 100px
`


const PlayerAvatar = (props: PlayerProps) => {
  const { player } = props;
  const { id} = player;
  const droppableId = JSON.stringify({ id, type: "player" });

  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <div className="grid-item center"   ref={provided.innerRef} {...provided.droppableProps}>
          <img src="./images/player_avatar.png" alt="your avatar"  style={{height: 50}}/>
        </div>
      )}
    </Droppable>
  );
};

export default PlayerAvatar;
