import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { UserGameState, whoami } from "./userSlice";

const useUserGameData = (): UserGameState => {
  const dispatch = useDispatch();
  const { isUserGameDataRetrieved, user, isLoading, error, gameData } = useSelector((state: RootState) => state.userGameState);
  console.log(`isUserGameDataRetrieved ${isUserGameDataRetrieved} user ${user} isLoading ${isLoading} error ${error} gameData ${gameData}`);
  useEffect(() => {
    if (isLoading || error || isUserGameDataRetrieved) return;
    setTimeout(() => {
      dispatch(whoami());
    }, 500);
    
  }, [dispatch, user, isUserGameDataRetrieved, isLoading, error]);

  return { isUserGameDataRetrieved, isLoading, error, user, gameData };
};

export default useUserGameData;
