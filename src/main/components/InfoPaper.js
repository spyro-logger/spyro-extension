import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    height: 175,
  },
  icon: {
    height: 50,
    width: 'auto',
    marginBottom: theme.spacing(1),
  },
}));

const InfoPaper = (props) => {
  const { Icon, header, subheader } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <Icon className={classes.icon} />
      <Typography variant="h5" component="h2">
        {header}
      </Typography>
      <Typography variant="h6" component="h3">
        {subheader}
      </Typography>
    </Paper>
  );
};

InfoPaper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  Icon: PropTypes.object.isRequired,
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
};

export default InfoPaper;
