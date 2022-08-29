import { FC } from "react";
import { useLocation } from "react-router-dom";

export type WaitingPageProps = {
  partyName: string;
};

const WaitingPage: FC<WaitingPageProps> = () => {
  const location = useLocation();
  const props = location.state as WaitingPageProps;
  let { partyName } = props;
  if (!partyName) partyName = "none";
  return <div>{partyName}</div>;
};

export default WaitingPage;
