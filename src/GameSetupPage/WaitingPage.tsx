import { FC } from "react";
import { useLocation } from "react-router-dom";

export type WaitingPageProps = {
  partyName: string;
};

const WaitingPage: FC<WaitingPageProps> = () => {
  let { partyName } = useLocation().state as WaitingPageProps;
  if(!partyName)partyName = "none"
  console.log(partyName)
  return <div>{partyName  || "none"}</div>;
};

export default WaitingPage;
