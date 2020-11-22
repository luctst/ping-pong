import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./views/Home";
import AddGame from "./views/AddGame";
import reportWebVitals from "./reportWebVitals";

document.body.style = "margin:0;padding:0;background-color:#115493";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact strict sensitive path="/" component={Home} />
        <Route exact strict sensitive path="/add" component={AddGame} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
