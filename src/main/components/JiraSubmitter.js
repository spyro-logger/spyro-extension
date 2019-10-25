import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

import injectValuesIntoTemplateDescription from '../utils/injectValuesIntoTemplateDescription';

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
  circularProgress: {
    marginLeft: theme.spacing(1),
  },
}));

const JiraSubmitter = (props) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const classes = useStyles();
  const { fieldValues } = props.selectedTemplate;

  const handleTitleChange = (event) => {
    const updatedTitleError = event.target.value.length > 254 ? TITLE_LENGTH_EXCEEDED : '';
    setTitleError(updatedTitleError);
    setTitle(event.target.value);
  };

  const populatedDescription = injectValuesIntoTemplateDescription(fieldValues.description, props.splunkSearchDetails);

  const onSubmit = (event) => {
    event.preventDefault();

    const populatedFieldValues = { ...fieldValues, description: populatedDescription, summary: title };
    props.onSubmit(populatedFieldValues);
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={titleError.length !== 0 || props.submissionInProgress}
      >
        {props.submissionInProgress ? (
          <div>
            Submitting
            <CircularProgress className={classes.circularProgress} color="secondary" size={22} />
          </div>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
};

JiraSubmitter.propTypes = {
  selectedTemplate: PropTypes.shape({
    fieldValues: PropTypes.shape({
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  splunkSearchDetails: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submissionInProgress: PropTypes.bool.isRequired,
};

export default JiraSubmitter;
