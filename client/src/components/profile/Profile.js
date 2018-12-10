import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PhotoCard from './PhotoCard';
import TitleCard from './TitleCard';
import InfoCard from './InfoCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: 8,
    marginBottom: 8,
  },
});

const Profile = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={8} xs={12} align="space-around">
        <TitleCard />
        <PhotoCard />
        <InfoCard />
      </Grid>
    </div>
  );
};

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
