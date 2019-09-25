import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

const TemplateSelector = (props) => {
  const { issueTemplates, indexOfSelectedTemplate, onSelectionChange } = props;

  const onSelectChange = (event) => {
    const { value } = event.target;
    onSelectionChange(value);
  };

  return (
    <>
      <Box>
        <FormControl fullWidth>
          <InputLabel htmlFor="age-simple">Jira Template</InputLabel>
          <Select value={indexOfSelectedTemplate} onChange={onSelectChange}>
            {issueTemplates.map((issueTemplate, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <MenuItem key={index} value={index}>
                {issueTemplate.name}
              </MenuItem>
            ))}
          </Select>
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
