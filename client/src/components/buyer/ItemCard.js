import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

// simula uma api call

const styles = () => ({
  divMain: {
    backgroundColor: '#aee',
    paddingBottom: '30px',
    width: '200px',
    height: '200px',
    margin: '10px',
    // display: 'flex',
  },
  wrapper: {
    margin: '20px',
  },
  title: {
    margin: '20px 0',
  },
});

const ItemCard = props => {
  const { classes, item } = props;
  return (
    <Paper elevation={4} className={classes.divMain}>
      <div className={classes.wrapper}>
        <Typography className={classes.title} variant="title">
          {item.title}
        </Typography>
        <Typography variant="body1">R$ - {item.price}</Typography>
      </div>
    </Paper>
  );
};

ItemCard.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default withStyles(styles)(ItemCard);
