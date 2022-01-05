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
  const { id, name, current, currentPhase, draws, plays, rolls, places, glitzaglitza, skipNextTurn } = player;

  return (
    <Droppable droppableId={id}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <img src="./images/player_avatar.png" alt="you" />
        </div>
      )}
    </Droppable>
  );
};

export default PlayerAvatar;
