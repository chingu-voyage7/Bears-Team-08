import React from 'react';
import { Route } from 'react-router-dom';

import SignIn from './auth/SignIn';
import Home from './home/Home';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ChangePassword from './auth/ChangePassword';
import PasswordSuccess from './auth/PasswordSuccess';
import EmailSuccess from './auth/EmailSuccess';
import EmailConfirmation from './auth/EmailConfirmation';

const Main = () => (
  <div>
    <Route path="/signin" component={SignIn} />
    <Route path="/register" component={Register} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/change-password/:email/:token" component={ChangePassword} />
    <Route path="/confirm-email" component={EmailConfirmation} />
    <Route path="/success-email/:email/:token" component={EmailSuccess} />
    <Route path="/success-password" component={PasswordSuccess} />
    <Route exact path="/" component={Home} />
  </div>
);

export default Main;