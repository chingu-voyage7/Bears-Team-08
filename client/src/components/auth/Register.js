import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RegistrationForm from './RegistrationForm';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
});

class Register extends Component {
  state = {
    redirect: false,
  };

  _setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  _renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/confirm-email" />;
    }
    return false;
  };

  _handleSubmit = async user => {
    const validated = await this._validateForm(user);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(user),
    };

    if (validated) {
      const res = await fetch(
        'http://localhost:3000/api/auth/register',
        options,
      );
      if (res.status === 200) {
        await this._setRedirect();
        await fetch(
          'http://localhost:3000/api/auth/email-confirmation',
          options,
        );
      }
    }
  };

  _validateForm = async () => true;

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this._renderRedirect()}
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <RegistrationForm
              className={classes.form}
              handleSubmit={this._handleSubmit}
              validateForm={this._validateForm}
            />
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
