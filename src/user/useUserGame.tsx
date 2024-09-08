import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { UserGameState, whoami } from "./userSlice";

const useUserGame = (): UserGameState => {
  const dispatch = useDispatch();
  const { isUserGameDataRetrieved, user, isLoading, error, gameData } = useSelector((state: RootState) => state.userGameState);

  useEffect(() => {
    if (isLoading || error || isUserGameDataRetrieved) return;

    dispatch(whoami());
  }, [dispatch, user, isUserGameDataRetrieved, isLoading, error]);
  // let userGameState;

  // if(isLoading) userGameState = 'loading';
  // if(error) userGameState = 'error';
  // if(user && !gameId) userGameState = 'userWithNoGame';
  // if(user && gameId) userGameState = 'userWithGame';

  // // if(isLoading) return {user: undefined, isNewUser: false, gameId: undefined, error: error};
  // if(isLoading) return {isNewUser: true, error: error};

  // const isNewUser = user && user.id === -1;

  return { isUserGameDataRetrieved, isLoading, error, user, gameData };
};

export default useUserGame;
