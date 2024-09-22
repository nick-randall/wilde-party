import "../css/chat-room.css";
const GameRulesSection: React.FC = () => {
  return (
    <section className="grid-right rules-section">
      <h1>Game Rules</h1>
      <h3>Goal</h3>
      <p>The wildest party wins</p>
      <p>
        Invite the coolest guests to your party and treat them to the trendiest party specials to keep the party rocking. But don't let the neighbours
        complain and call the police!
      </p>
      <p>The first player to reach the needed party points wins.</p>
    </section>
  );
};

export default GameRulesSection;
