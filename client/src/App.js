import React, { useEffect, useContext } from 'react';
import { UserContext } from './context/User';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
import Main from './components/Main';

const App = () => {
  let { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) dispatch({ type: 'getUser', payload: user });
  }, []);
  return (
      <Router>
        <div className="App">
          <Header />
          <Main />
        </div>
      </Router>
  );
};


export default App;
