function checkIfThereAreInstances(typeOfInstance, settings) {
  return (
    settings &&
    settings.shared &&
    settings.shared[typeOfInstance].instances &&
    settings.shared[typeOfInstance].instances.length > 0
  );
}

function findInstance(typeOfInstance, key, settings) {
  const matchingInstance = settings.shared[typeOfInstance].instances.find((instance) => instance.key === key);
  if (matchingInstance) {
    return matchingInstance;
  }

  return {};
}

/**
 * Utilities to improve the consumption of settings data.
 */
const SettingsUtility = {
  /**
   * Retrieves the Jira instance associated with the key.
   *
   * @param {Object} settings
   *    The settings of the extension.
   * @param {String} instanceKey
   *    A string for the Jira instance to retrieve.
   * @returns {Object} The data for the Jira instance associated to the key provided. If no data is found, an empty
   *                   object is returned.
   */
  getJiraInstanceByKey: (settings, instanceKey) => {
    if (checkIfThereAreInstances('jira', settings)) {
      return findInstance('jira', instanceKey, settings);
    }

    return {};
  },

  /**
   * Retrieves the Splunk instance associated with the key.
   *
   * @param {Object} settings
   *    The settings of the extension.
   * @param {String} instanceKey
   *    A string for the Splunk instance to retrieve.
   * @returns {Object} The data for the Splunk instance associated to the key provided. If no data is found, an empty
   *                   object is returned.
   */
  getSplunkInstanceByKey: (settings, instanceKey) => {
    if (checkIfThereAreInstances('splunk', settings)) {
      return findInstance('splunk', instanceKey, settings);
    }

    return {};
  },
};

export default SettingsUtility;
