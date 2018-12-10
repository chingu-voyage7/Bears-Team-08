import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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

const PhotoCard = props => {
  const { classes } = props;

  return (
    <Grid item xs={12} md={4}>
      <Paper className={classes.paperContainer}>
        <Paper className={classes.paper}>Photo</Paper>
        <Paper className={classes.paper}>Rating</Paper>
        <Paper className={classes.paper}>Items Bought</Paper>
        <Paper className={classes.paper}>Items Sold</Paper>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(PhotoCard);
