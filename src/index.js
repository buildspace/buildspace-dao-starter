import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react';

import './assets/scss/style.scss';

const history = createBrowserHistory();

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Polygon;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router history={history}>
      <ThirdwebProvider desiredChainId={activeChainId} supportedChains={[activeChainId]}>
        <App />
      </ThirdwebProvider>
    </Router>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();