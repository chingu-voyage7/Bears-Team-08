import React, { useEffect, useContext } from 'react';
import { UserContext } from './context/User';
import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './context/User';
import Header from './components/header/Header';
import Main from './components/Main';

const App = () => (
  <UserProvider>
    <Router>
      <div className="App">
        <Header />
        <Main />
      </div>
    </Router>
  </UserProvider>
);


export default App;
