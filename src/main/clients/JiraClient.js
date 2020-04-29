import axios from 'axios';

/**
 * Create a new JIRA issue.
 * For more information, see the link provided below:
 * https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post)
 *
 * @param {String} spyroServerBaseUrl
 *    The base url for spyro server.
 * @param {String} jiraHost
 *    The host to connect for the jira instance. Ex: jira.somehost.com
 * @param {Object} jiraCredential
 *    The jira credential object consisting of user name and password to authenticate requests.
 * @param {Object} fieldValues
 *    The object containing the fields for creating issue. These fields are wrapped in 'fields' key before calling jira api.
 *    For more information refer to fields section in the above mentioned JIRA document.
 * @returns {Object} The response data for the created issue.
 */
const createIssue = async (spyroServerBaseUrl, jiraHost, jiraCredential, fieldValues) => {
  try {
    const addNewIssueUrl = `${spyroServerBaseUrl}/jira/issue`;
    const basicAuth = `Basic ${btoa(`${jiraCredential.username}:${jiraCredential.password}`)}`;
    const headers = { 'Content-Type': 'application/json', Authorization: basicAuth };

    const payLoadData = JSON.stringify({ jiraHost, fieldValues });

    return await axios.post(addNewIssueUrl, payLoadData, { headers });
  } catch (error) {
    const errorMessage = `Error while creating JIRA issue: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error('Failed to create Jira!');
  }
};

export default { createIssue };
