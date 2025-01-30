import * as React from 'react'
import * as ReactDOM from 'react-dom'
import logger from './ui/utils/logger'

import App from './ui/app'

declare global {
  interface Window {
	REACT_APP_SUBJECT_ALIAS: string | null;
  }
}

// Lesen Sie den Parameter aus der URL
const urlParams = new URLSearchParams(window.location.search);
const subjectAlias = urlParams.get('subject_alias');

// Setzen Sie den Wert im window-Objekt
window.REACT_APP_SUBJECT_ALIAS = subjectAlias || "null";

localStorage.removeItem('hb:gameState');

const app = <App />

ReactDOM.render(app, document.getElementById('app')!)

console.log(window.REACT_APP_SUBJECT_ALIAS)




logger.log('System', 'Game', 'Start');
