import * as React from 'react';

let ConfigContext = React.createContext();

let initialState = {
  url: 'http://localhost:3000'
};

let reducer = (state, action) => {
  switch (action.type) {
    case 'production':
      return {
        url: "https://bears-team-08.herokuapp.com" };
    default:
      return { ...state };
  }
};

function ConfigProvider(props) {
  // [A]
  let [config, dispatch] = React.useReducer(reducer, initialState);
  let value = { config, dispatch };

  // [B]
  return (
    <ConfigContext.Provider value={value}>{props.children}</ConfigContext.Provider>
  );
}

let { Consumer } = ConfigContext;

// [C]
export { ConfigContext, ConfigProvider, Consumer };
