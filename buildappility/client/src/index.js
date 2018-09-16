import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import GoogleMap from './google-map'
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<GoogleMap />, document.getElementById('root'))
registerServiceWorker();
