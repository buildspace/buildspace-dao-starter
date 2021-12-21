import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

//import ThirdWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

//include chains to support
// 4 = Rinkeby
const supportedChainIds = [4];

// include type of wallet to support
// metamask which is an "injected wallet"
const connectors = {
  injected: {},
};


// Render the App component to the DOM
// wrap App with ThirdwebWeb3Provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
       connectors={ connectors }
       supportedChainIds={ supportedChainIds }
    >
      <div className="landing">
        <App />
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
