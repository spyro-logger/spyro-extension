import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
  },
}));

const OptionsForm = (props) => {
  const { onSave, statuses, configuration } = props;

  const [settingsUrl, setSettingsRepositoryUrl] = useState(configuration.settingsRepositoryUrl);
  const classes = useStyles();

  const onInputChange = (event) => {
    const { value } = event.target;

    switch (event.target.name) {
      case 'settings-file': {
        setSettingsRepositoryUrl(value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formValues = {
      settingsRepositoryUrl: settingsUrl,
    };
    onSave(formValues);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={10} sm={11}>
          <TextField
            fullWidth
            label="Settings URL"
            name="settings-file"
            id="settings-file-field"
            onChange={onInputChange}
            value={settingsUrl}
            error={statuses.settingsFetchErrorOccurred}
            helperText={statuses.settingsFetchErrorOccurred ? 'Error fetching settings' : ''}
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <Button variant="contained" color="primary" type="submit" className={classes.button} fullWidth>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

OptionsForm.propTypes = {
  configuration: PropTypes.shape({
    settingsRepositoryUrl: PropTypes.string,
  }),
  statuses: PropTypes.shape({
    settingsFetchErrorOccurred: PropTypes.bool,
  }),
  onSave: PropTypes.func,
};

OptionsForm.defaultProps = {
  configuration: {
    settingsRepositoryUrl: '',
  },
  statuses: {
    settingsFetchErrorOccurred: false,
  },
  onSave: () => {},
};

export default OptionsForm;
