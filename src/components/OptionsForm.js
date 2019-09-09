import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(4),
  },
}));

const OptionsForm = (props) => {
  const { onSave, statuses, configuration } = props;

  const [settingsRepositoryUrl, setSettingsRepositoryUrl] = useState(configuration.settingsRepositoryUrl);
  const classes = useStyles();

  const onInputChange = (event) => {
    const value = event.target.value;

    switch (event.target.name) {
      case 'settings-repository': {
        return setSettingsRepositoryUrl(value);
      }
      default: {
        break;
      }
    }
  };

  const handleFormSubmit = () => {
    const formValues = {
      settingsRepositoryUrl,
    };
    onSave(formValues);
  };

  return (
    <div>
      <TextField
        label="Settings Github Repository"
        name="settings-repository"
        id="settings-repository-field"
        onChange={onInputChange}
        value={settingsRepositoryUrl}
        fullWidth
        error={statuses.settingsFetchErrorOccurred}
        helperText={statuses.settingsFetchErrorOccurred ? 'Error fetching settings' : ''}
      />
      <Button variant="contained" color="primary" type="submit" className={classes.button} onClick={handleFormSubmit}>
        Save
      </Button>
    </div>
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
