import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

const activeChainId = ChainId.Rinkeby;

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);