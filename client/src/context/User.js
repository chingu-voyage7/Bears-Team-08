import * as React from 'react';

let UserContext = React.createContext();

let initialState = {
  isLoggedIn: true,
  email: '',
};


let reducer = (state, action) => {
  switch (action.type) {
    case 'signIn':
      return { ...state, isLoggedIn: true };
    case 'update':
      return { ...state, [action.payload.name]: action.payload.value };
    case 'signOut':
      return { isLoggedIn: false, email: '' };
    default:
      return { ...state };
  }
};

function UserProvider(props) {
  // [A]
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  // [B]
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

let { Consumer } = UserContext;

// [C]
export { UserContext, UserProvider, Consumer };
