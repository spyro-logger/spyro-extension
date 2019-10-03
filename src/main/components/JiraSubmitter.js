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

import injectValuesIntoTemplateSummary from '../utils/injectValuesIntoTemplateSummary';

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
  const classes = useStyles();

  const handleTitleChange = (event) => setTitle(event.target.value);

  const summary = injectValuesIntoTemplateSummary(
    props.selectedTemplate.fieldValues.summary,
    props.splunkSearchDetails,
  );

  const onSubmit = (event) => {
    event.preventDefault();

    const jiraSubmission = {
      title,
      summary,
    };

    // eslint-disable-next-line no-console
    console.log(jiraSubmission);
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        id="standard-name"
        label="Jira Title"
        margin="normal"
        fullWidth
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
            Summary
          </FormLabel>
          <pre>{summary}</pre>
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
    fieldValues: PropTypes.shape({
      summary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  splunkSearchDetails: PropTypes.object.isRequired,
};

export default JiraSubmitter;
