import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import BuyItem from './BuyItem';
import ItemDetails from './ItemDetails';
import Questions from './Questions';

const styles = () => ({
  divMain: {
    backgroundColor: '#eee',
    paddingBottom: '30px',
  },
});

// TODO: fetch the item that is on the params here
class Item extends Component {
  state = {
    item: [],
    loading: true,
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.divMain}>
        <BuyItem />
        <ItemDetails />
        <Questions />
      </Paper>
    );
  }
}

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);
