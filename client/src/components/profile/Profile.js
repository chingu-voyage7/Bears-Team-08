import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const Profile = props => {
  const {user, setUser} = useState();
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Paper style={{ flex: 1, margin: 16 }}>
      <Grid container spacing={16} xs={12} align="center" justify="space-between">
        <Grid item xs={3}>
          <Paper className={classes.paper}>Photo</Paper>
          <Paper className={classes.paper}>Rating</Paper>
          <Paper className={classes.paper}>Items Bought</Paper>
          <Paper className={classes.paper}>Items Sold</Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper} style={{marginTop: 8, marginBottom: 8}}>
            <TextField
              required
              type="text"
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="fname"
              onChange={e =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              />
            </Paper>
          <Paper className={classes.paper} style={{marginTop: 8, marginBottom: 8}}>
            <TextField
              required
              type="text"
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="fname"
              onChange={e =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              />
            </Paper>
          <Paper className={classes.paper} style={{marginTop: 8, marginBottom: 8}}>
            <TextField
              required
              type="text"
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="fname"
              onChange={e =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              />
            </Paper>
          <Paper className={classes.paper} style={{marginTop: 8, marginBottom: 8}}>
            <TextField
              required
              type="text"
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="fname"
              onChange={e =>
                setUser({ ...user, [e.target.name]: e.target.value })
              }
              />
            </Paper>
        
        </Grid>
      </Grid>
        </Paper>
    </div>
  );
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
