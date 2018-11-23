import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
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
            type="text"
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
            type="text"
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
            type="email"
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
            type="password"
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
            type="password"
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
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleSubmit(user)}
        style={{ marginTop: '2vh' }}
      >
        Register
      </Button>
    </React.Fragment>
  );
};

export default RegistrationForm;
