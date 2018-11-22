import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
import Main from './components/Main';

const App = () => (
  <Router>
    <div className="App">
      <Header />
      <Main />
    </div>
  </Router>
  
);

export default App;
