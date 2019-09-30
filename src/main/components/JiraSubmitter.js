import React from 'react';
import PropTypes from 'prop-types';
import injectValuesIntoTemplateSummary from '../utils/injectValuesIntoTemplateSummary';

const sampleValues = {
  splunk_event_count: '52',
  splunk_event_content: 'Some error occurred',
  splunk_search_range: 'Date 1 to Date 2',
  splunk_search_string: 'INDEX=GITHUB',
  splunk_search_url_without_sid: 'http://google.com',
  settings_current_user_id: 'dv297',
};

const JiraSubmitter = (props) => {
  // TODO: Pull injected values from splunkSearchDetails and remove sampleValues
  const valuesToInject = {
    ...sampleValues,
    ...props.splunkSearchDetails,
  };
  const summary = injectValuesIntoTemplateSummary(props.selectedTemplate.fieldValues.summary, valuesToInject);

  return (
    <div>
      <pre>{summary}</pre>
    </div>
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
