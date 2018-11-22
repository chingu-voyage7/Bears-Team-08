import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const RegistrationForm = props => {
  const [user, setUser] = useState({});
  const { handleSubmit } = props;

  return (
    <React.Fragment>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="fname"
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="lname"
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="Email Address"
            fullWidth
            autoComplete="email"
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            fullWidth
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            fullWidth
            onChange={e =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </Grid>
      </Grid>
      <Button
        component={Link}
        to="/confirm-email"
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleSubmit(user)}
      >
        Register
      </Button>
    </React.Fragment>
  );
};

export default RegistrationForm;
