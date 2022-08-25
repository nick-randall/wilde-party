import { FC, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApi } from "../api/useApi";
import { SessionContext } from "../SessionProvider";

interface CreateGamePageProps {}

const CreateGamePage: FC<CreateGamePageProps> = () => {
  const location = useLocation();
  const api = useApi();
  const { sessionToken } = useContext(SessionContext);
  useEffect(() => {
    if (sessionToken) api.createNewGame(sessionToken, 3, 3, "me is creator,", "my Party");
  });
  return <div></div>;
};

export default CreateGamePage;
