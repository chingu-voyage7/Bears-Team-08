import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
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
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  title: {
    marginBottom: '2vh',
  },
});

const ForgotPassword = props => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    token: '',
  });

  const [redirect, setRedirect] = useState(false);

  const { classes } = props;

  useEffect(() => setUser({ ...user, ...props.match.params }), [user]);


  const _renderRedirect = () => {
    if (redirect) {
      return <Redirect to="/success-password" />;
    }
  };


  const onSubmit = async e => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ user }),
    };

    e.preventDefault();
    if (user.password === user.confirmPassword) {
      const res = await fetch(
        `http://localhost:3000/api/auth/change-password`,
        options,
      );
      if (res.ok) setRedirect(true);
    }
  };

  return (
    <main className={classes.main}>
      { _renderRedirect() }
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.title}>
          Change Password
        </Typography>
        <Typography component="h5" variant="body1" paragraph>
          Please enter your new password and confirm.
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="newPassword">New Password</InputLabel>
            <Input
              name="newPassword"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="newPasswordConfirm">
              Confirm Password
            </InputLabel>
            <Input
              name="newPasswordConfirm"
              type="password"
              id="newPasswordConfirm"
              autoComplete="new-password-confirm"
              onChange={e =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
          </FormControl>
          <Button
            onClick={e => onSubmit(e)}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
        </form>
      </Paper>
    </main>
  );
};

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForgotPassword);
