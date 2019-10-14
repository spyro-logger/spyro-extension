import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

import injectValuesIntoTemplateDescription from '../utils/injectValuesIntoTemplateDescription';
import Credentials from '../utils/Credentials';
import JiraClient from '../clients/JiraClient';

const TITLE_LENGTH_EXCEEDED = 'Title cannot exceed 254 characters';

const useStyles = makeStyles((theme) => ({
  titleField: {
    marginBottom: theme.spacing(3),
  },
  previewPanel: {
    marginBottom: theme.spacing(4),
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginTop: theme.spacing(1),
  },
}));

const JiraSubmitter = (props) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const classes = useStyles();
  const { fieldValues, jiraInstance } = props.selectedTemplate;

  const handleTitleChange = (event) => {
    const updatedTitleError = event.target.value.length > 254 ? TITLE_LENGTH_EXCEEDED : '';
    setTitleError(updatedTitleError);
    setTitle(event.target.value);
  };

  function getJiraHost(key) {
    const selectedInstance = props.jiraInstances.find((instance) => instance.key === key);

    if (selectedInstance) {
      const currentHost =
        process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? selectedInstance.devHost
          : selectedInstance.host;

      return currentHost;
    }

    return undefined;
  }

  const populatedDescription = injectValuesIntoTemplateDescription(fieldValues.description, props.splunkSearchDetails);

  const onSubmit = (event) => {
    event.preventDefault();

    const populatedFieldValues = { ...fieldValues, description: populatedDescription, summary: title };

    Credentials.getEntryByKey(jiraInstance).then((jiraCredential) => {
      const jiraHost = getJiraHost(jiraInstance);

      if (!jiraHost) {
        // eslint-disable-next-line no-console
        console.log('Jira host is not specified');
      }

      JiraClient.createIssue(jiraHost, jiraCredential, populatedFieldValues)
        .then((response) => {
          props.onJIRAIssueCreation(response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        error={titleError.length !== 0}
        id="standard-name"
        label="Jira Title"
        margin="normal"
        required
        fullWidth
        helperText={titleError || ''}
        className={classes.titleField}
        value={title}
        onChange={handleTitleChange}
      />
      <ExpansionPanel className={classes.previewPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Preview</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelContent}>
          <FormLabel component="legend" className={classes.label}>
            Issue Description
          </FormLabel>
          <pre>{populatedDescription}</pre>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

JiraSubmitter.propTypes = {
  selectedTemplate: PropTypes.shape({
    jiraInstance: PropTypes.string.isRequired,
    fieldValues: PropTypes.shape({
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  splunkSearchDetails: PropTypes.object.isRequired,
  onJIRAIssueCreation: PropTypes.func.isRequired,
  jiraInstances: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default JiraSubmitter;
