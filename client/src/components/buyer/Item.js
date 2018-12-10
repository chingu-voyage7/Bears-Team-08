import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Button } from '@material-ui/core';

import BuyItem from './BuyItem';
import ItemDetails from './ItemDetails';
import Questions from './Questions';
import { item } from '../../mock';

const styles = theme => ({
  divMain: {
    backgroundColor: '#eee',
    paddingBottom: '30px',
  },
});

const Item = props => {
  const { classes } = props;
  return (
    <Paper className={classes.divMain}>
      <BuyItem />
      <ItemDetails />
      <Questions />
    </Paper>
  );
};

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);
