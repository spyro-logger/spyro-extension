import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const TemplateSelector = (props) => {
  const { issueTemplates, indexOfSelectedTemplate, onSelectionChange } = props;

  const onSelectChange = (event, newValue) => {
    onSelectionChange(newValue);
  };

  return (
    <>
      <Box>
        <FormControl fullWidth>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={indexOfSelectedTemplate}
            onChange={onSelectChange}
            id="jira-template-select"
          >
            {issueTemplates.map((issueTemplate, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <ToggleButton key={index} value={index}>
                {issueTemplate.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>
      </Box>
    </>
  );
};

TemplateSelector.propTypes = {
  issueTemplates: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  indexOfSelectedTemplate: PropTypes.number.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default TemplateSelector;
