import { FC, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApi } from "../api/useApi";
import { AuthContext } from "../App";

interface CreateGamePageProps {}

const CreateGamePage: FC<CreateGamePageProps> = () => {
  const location = useLocation();
  const api = useApi();
  const token = useContext(AuthContext);
  useEffect(() => {
    if (token) api.createNewGame(token, 3, 3, "me is creator,", "my Party");
  });
  return <div></div>;
};

export default CreateGamePage;
