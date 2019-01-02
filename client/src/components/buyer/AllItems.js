import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

// this is gonna be a api
const styles = () => ({
  divMain: {
    backgroundColor: '#eee',
    paddingBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '250px',
    height: '450px',
    background: 'red',
    margin: '15px',
  },
  image: {
    maxWidth: '250px',
    maxHeight: '250px',
  },
});

class AllItems extends Component {
  state = {
    search: '',
    items: [],
  };

  componentDidMount() {
    const getData = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
      );
      const items = await response.json();
      this.setState({
        items,
      });
    };
    getData();
  }

  handleInputChange = event => {
    this.setState({
      search: event.target.value,
    });
  };

  handleClick = id => {
    console.log(id);
  };

  render() {
    const { classes } = this.props;
    const { items } = this.state;

    return (
      <Paper className={classes.divMain}>
        <div className={classes.wrapper}>
          {items.map(item => (
            <div
              onClick={() => this.handleClick(item.id)}
              className={classes.card}
              key={item.id}
            >
              <img
                className={classes.image}
                src="https://http2.mlstatic.com/macbooks-D_Q_NP_804475-MLB28289378721_102018-Q.webp"
                alt={item.title}
              />
              <p>R$ 4200</p>
              <p>Macbook Air, Intel Core I5,8gb,128gb,tela 13,3 - Mqd32bz/a</p>
              <p>{item.id}</p>
            </div>
          ))}
        </div>
      </Paper>
    );
  }
}

AllItems.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AllItems);
