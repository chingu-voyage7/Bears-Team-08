import React, { useEffect, useContext } from 'react';
import { UserContext, ConfigContext } from './context';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
import Main from './components/Main';

const App = () => {
  let { dispatch } = useContext(UserContext);
  let config = useContext(ConfigContext);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') config.dispatch({ type: 'production'})
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
