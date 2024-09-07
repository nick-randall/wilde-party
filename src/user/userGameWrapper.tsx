import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { whoami } from "./userSlice";
import HomePage from "../HomePage";

interface UserGameWrapperProps {
  children: (props: UserGameProps) => React.ReactNode;
}

interface UserGameProps {
  user?: User;
  gameId?: number;
  error: string;
}

const UserGameWrapper: React.FC<UserGameWrapperProps> = ({children}) => {
  const dispatch = useDispatch();
  const {user, isLoading, error, gameId} = useSelector((state: RootState) => state.userGameState);


  useEffect(() => {
    if (isLoading || error) return;

    if (!user) {
      dispatch(whoami());
    }
  }, [dispatch, user, isLoading, error]);

  // if(isLoading) return <HomePage user={undefined} gameId = {undefined}></HomePage>;
  
  const userProp = !user || user.id === -1 ? undefined : user;

  return <>{children({user: userProp, error, gameId})}</>;
};

export default UserGameWrapper;
