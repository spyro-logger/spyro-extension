const compileString = require('es6-template-strings');

function validateNotNullOrUndefined(element, elementName = 'Element') {
  if (typeof element === 'undefined' || element === null) {
    throw new Error(`${elementName} is not defined or is null`);
  }

  return element;
}

function validateRequiredValues(configurationValues) {
  const requiredProperties = [
    'splunk_event_count',
    'splunk_event_content',
    'splunk_search_range',
    'splunk_search_string',
    'splunk_search_url_without_sid',
    'settings_current_user_id',
  ];
  requiredProperties.forEach((property) => validateNotNullOrUndefined(configurationValues[property], property));
}

function injectValuesIntoTemplateSummary(template, configurationValues) {
  validateRequiredValues(configurationValues);

  return compileString(template, configurationValues);
}

export default injectValuesIntoTemplateSummary;
