import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Grid,
  Button,
  } from '@material-ui/core';
import { item } from '../../mock';

const styles = theme => ({
  divMain: {
    backgroundColor: '#eee',
  },
  div: {
    maxWidth: '1180px',
    color: 'white',

    padding: '20px',
    display: 'flex',
    margin: '2px auto',
  },
  paper: {
    backgroundColor: '#fff',
    width: '100%',
    // margin: theme.spacing.unit,
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // paperLeft: {

  // },

  leftCard: {
    margin: theme.spacing.unit,
  },
  leftCardTypo: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  price: {
    color: '#1a5',
    margin: '20px 0',
    // padding: '50px',
  },
  span: {
    color: '#bbb',
  },
});

// const data = {
//   title: 'Apple Macbook Air 13 I5 1.8ghz 8gb 128gb Ssd Mqd32',
//   state: 'Novo', // new or not
//   nSold: 9, // number of items sold
//   price: 5599.0,
//   times: 12, // how many times it can be paid by
// };

const BuyItem = props => {
  const { classes } = props;
  return (
    <Paper className={classes.divMain}>
      <div className={classes.div}>
        <Grid container spacing={16} className={classes.mainGrid}>
          <Grid item xs={12} md={7} container>
            <Paper elevation={4} className={classes.paper}>
              <Typography>there should be an image here</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5} container>
            <Paper elevation={4} className={classes.paper}>
              <div className={classes.leftCard}>
                <Typography className={classes.leftCardTypo}>
                  {item.state} - {item.nSold} vendidos
                </Typography>
                <Typography className={classes.leftCardTypo} variant="headline">
                  {item.name}
                </Typography>

                <Typography className={classes.leftCardTypo} variant="display1">
                  R$ {item.price}
                </Typography>

                <Typography
                  className={classes.leftCardTypo}
                  variant="subtitle1"
                >
                  <p className={classes.price}>
                    Em até {item.times}x{' '}
                    {parseFloat(
                      // shows .2 decimal points only
                      Math.round((item.price / item.times) * 100) / 100,
                    ).toFixed(2)}{' '}
                    sem juros
                  </p>
                </Typography>

                <Typography
                  className={classes.leftCardTypo}
                  variant="subtitle1"
                >
                  <p className={classes.price}>Frete Grátis</p>
                </Typography>

                <Typography
                  className={classes.leftCardTypo}
                  variant="subtitle1"
                >
                  <p className={classes.price}>Devolução Grátis</p>
                </Typography>

                <Typography className={classes.leftCardTypo} variant="caption">
                  <span className={classes.span}>Último disponível!</span>
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Comprar Agora!
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  Adcionar ao carrinho
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

BuyItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BuyItem);
