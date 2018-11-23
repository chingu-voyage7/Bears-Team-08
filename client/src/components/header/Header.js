import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/User';
import green from '@material-ui/core/colors/green';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  snack: {
    backgroundColor: green[600],
  },
};

const MenuAppBar = ({ classes }) => {
  const vertical = 'top';
  const horizontal = 'center';

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnack, setSnack] = useState(false);
  let {
    state: { isLoggedIn },
    dispatch,
  } = useContext(UserContext);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    dispatch({ type: 'signOut' });
    setSnack(true);
    setAnchorEl(null);
  };

  const closeSnack = () => {
    setSnack(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnack}
          autoHideDuration={1500}
          onClose={closeSnack}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          className={classes.snack}
          message={<span id="message-id">Signed out successfully!</span>}
        />
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Bears Team 08
          </Typography>
          {!isLoggedIn && (
            <div>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
              <Button component={Link} to="/signin" color="inherit">
                Sign In
              </Button>
            </div>
          )}
          {isLoggedIn && (
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={signOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);
