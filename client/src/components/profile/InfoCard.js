import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 8,
  },
  paperContainer: {
    flex: 1,
    margin: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

const InfoCard = props => {
  const { classes } = props;
  const [user, setUser] = useState();

  return (
    <Grid item xs={12} md={8}>
      <Paper className={classes.paperContainer}>
        <Paper className={classes.paper}>
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
        <Paper className={classes.paper}>
          <TextField
            required
            type="text"
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="lname"
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Paper>
        <Paper className={classes.paper}>
          <TextField
            required
            type="text"
            id="Location"
            name="Location"
            label="Location"
            fullWidth
            autoComplete="location"
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Paper>
        <Paper className={classes.paper}>
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
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(InfoCard);
