import * as React from 'react'
import * as ReactDOM from 'react-dom'
import logger from './ui/utils/logger'

import App from './ui/app'

const app = <App />

ReactDOM.render(app, document.getElementById('app')!)

logger.log('System', 'Game', 'Start');
