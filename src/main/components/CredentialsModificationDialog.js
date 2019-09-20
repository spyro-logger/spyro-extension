import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SharedInstancesConfigurationShape from '../proptypes/SharedInstancesConfiguration';

const InstancesList = (props) => {
  const { idLabel, instances, selectedInstances, onInstanceClick } = props;

  return (
    <List id={`${idLabel}-instances-list`}>
      {instances.map((instance, index) => {
        const labelId = `${idLabel}-checkbox-list-label-${instance.key}`;
        return (
          <ListItem key={instance.key} dense button onClick={() => onInstanceClick(instance.key)}>
            <ListItemIcon>
              <Checkbox onChange={() => {}} value={index} checked={selectedInstances.includes(instance.key)} />
            </ListItemIcon>
            <ListItemText id={labelId} primary={instance.key} />
          </ListItem>
        );
      })}
    </List>
  );
};

InstancesList.propTypes = {
  idLabel: PropTypes.string.isRequired,
  instances: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedInstances: PropTypes.arrayOf(PropTypes.string).isRequired,
  onInstanceClick: PropTypes.func.isRequired,
};

const CredentialsModificationForm = (props) => {
  const {
    onCancel,
    onSave,
    username: initialUsername,
    password: initialPassword,
    sharedInstancesConfiguration,
  } = props;
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [selectedJiraInstances, setSelectedJiraInstances] = useState([]);
  const [selectedSplunkInstances, setSelectedSplunkInstances] = useState([]);

  const jiraInstances = sharedInstancesConfiguration.jira.instances;
  const splunkInstances = sharedInstancesConfiguration.splunk.instances;

  const onInputChange = (event) => {
    const { value } = event.target;
    switch (event.target.id) {
      case 'username': {
        setUsername(value);
        break;
      }
      case 'password': {
        setPassword(value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const updateSelectedInstances = (instanceKeyModified, selectedInstances, setter) => {
    if (selectedInstances.includes(instanceKeyModified)) {
      const updatedInstances = selectedInstances.filter((key) => key !== instanceKeyModified);
      setter(updatedInstances);
    } else {
      const updatedInstances = [...selectedInstances, instanceKeyModified];
      setter(updatedInstances);
    }
  };

  const onSaveButtonClick = () => {
    const valuesToSave = {
      username,
      password,
      selectedJiraInstances,
      selectedSplunkInstances,
    };
    onSave(valuesToSave);
  };

  return (
    <>
      <DialogTitle id="form-dialog-title">Credentials</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={onInputChange}
        />
        <DialogContentText htmlFor="jira-instances-list">Use credential for these Jira instances:</DialogContentText>
        <InstancesList
          idLabel="jira"
          instances={jiraInstances}
          selectedInstances={selectedJiraInstances}
          onInstanceClick={(selectedInstanceKey) =>
            updateSelectedInstances(selectedInstanceKey, selectedJiraInstances, setSelectedJiraInstances)
          }
        />
        <DialogContentText>Use credential for these Splunk instances:</DialogContentText>
        <List>
          <InstancesList
            idLabel="splunk"
            instances={splunkInstances}
            selectedInstances={selectedSplunkInstances}
            onInstanceClick={(selectedInstanceKey) =>
              updateSelectedInstances(selectedInstanceKey, selectedSplunkInstances, setSelectedSplunkInstances)
            }
          />
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onSaveButtonClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </>
  );
};

CredentialsModificationForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  sharedInstancesConfiguration: SharedInstancesConfigurationShape.isRequired,
};

CredentialsModificationForm.defaultProps = {
  username: '',
  password: '',
};

const CredentialsModificationDialog = (props) => {
  const { isOpen } = props;

  return (
    <Dialog open={isOpen} onClose={() => {}} aria-labelledby="form-dialog-title">
      <CredentialsModificationForm {...props} />
    </Dialog>
  );
};

CredentialsModificationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CredentialsModificationDialog;
