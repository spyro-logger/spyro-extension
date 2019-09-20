import PropTypes from 'prop-types';

const SharedInstanceShape = {
  key: PropTypes.string.isRequired,
};

const SharedInstancesConfigurationShape = PropTypes.shape({
  splunk: PropTypes.shape({
    instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
  }),
  jira: PropTypes.shape({
    instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
  }),
});

const SharedInstancesConfigurationDefaultValue = {
  splunk: [],
  jira: [],
};

export default SharedInstancesConfigurationShape;
export { SharedInstancesConfigurationDefaultValue };
