import PropTypes from 'prop-types';

import SharedInstanceShape from './SharedInstanceShape';

const SharedInstanceConfigurationShape = PropTypes.shape({
  splunk: PropTypes.shape({
    instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
  }),
  jira: PropTypes.shape({
    instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
  }),
});

const SharedInstanceConfigurationShapeDefaultValue = {
  splunk: {
    instances: [],
  },
  jira: {
    instances: [],
  },
};

export default SharedInstanceConfigurationShape;
export { SharedInstanceConfigurationShapeDefaultValue };
