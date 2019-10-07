import React from 'react';
import { AppBar, makeStyles, Typography, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import navigateToOptionsPage from '../utils/navigateToOptionsPage';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#212121',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    color: '#fff',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    flexGrow: 2,
  },
  settingsIcon: {
    justifySelf: 'flex-end',
    color: '#9E9E9E',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position="relative" className={classes.appbar}>
      <Typography component="h1" variant="h4" className={classes.title}>
        Spyro
      </Typography>
      <IconButton onClick={navigateToOptionsPage}>
        <SettingsIcon className={classes.settingsIcon} />
      </IconButton>
    </AppBar>
  );
};

export default Header;
