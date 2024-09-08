export const CenterContent:React.FC = ({children}) => (
  <header className="App-header">
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column"}}>{children}</div>
    </div>
  </header>
);
