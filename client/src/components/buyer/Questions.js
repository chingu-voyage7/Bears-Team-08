import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Button } from '@material-ui/core';

import BuyItem from './BuyItem';
import ItemDetails from './ItemDetails';
import { item } from '../../mock';

const styles = theme => ({
  divMain: {
    backgroundColor: '#eee',
  },
  div: {
    maxWidth: '1180px',
    padding: '20px',
    display: 'flex',
    margin: '0 auto',
    // marginTop: '-21px',
  },
  paper: {
    backgroundColor: '#fff',
    width: '100%',
    // margin: theme.spacing.unit,
    // height: '500px',
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // color: '#000',
  },
  description: {
    margin: '20px',
    // justifyContent: 'flex-start',
    // textAlign: 'justify',
  },
  title: {
    color: 'red',
  },
  answer: {
    color: 'blue',
  }
});

const Item = props => {
  const { classes } = props;

  const renderQuestions = item.questions.map((question, i) => (
    <div key={i}>
      <p className={classes.title}>{question.title}</p>
      <p className={classes.answer}>{question.answer}</p>
      <br />
    </div>
  ));

  return (
    <div className={classes.div}>
      <Grid container spacing={16} className={classes.mainGrid}>
        <Grid item xs={12} md={7} container>
          <Paper elevation={4} className={classes.paper}>
            <div className={classes.description}>{renderQuestions}</div>
          </Paper>
        </Grid>

        {/* <Grid item xs={12} md={5} container>
          <Paper elevation={4} className={classes.paper}>
            <div>
              <p>nothing here</p>
            </div>
          </Paper>
        </Grid> */}
      </Grid>
    </div>
  );
};

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);
