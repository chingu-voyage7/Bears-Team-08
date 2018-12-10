import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  container: {
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
});

const TitleCard = props => {
  const { classes } = props;
  return (
    <Grid xs={12} className={classes.container}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(TitleCard);
