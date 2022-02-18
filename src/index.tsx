import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Table } from "./Table";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  HomePage  from "./HomePage";



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
            {/* can put layout wrapper here*
            <Route /> */}
            <Route path= "game" element={<Table />} />
          
          {/* <Table /> */}
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
