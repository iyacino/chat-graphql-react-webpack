import React from "react";
import ReactDOM from "react-dom";
import Chat from "./Chat";

import "./index.css";


const App = () => {
    return(
        <Chat />       
    )
}

ReactDOM.render(<App />, document.getElementById("app"));
