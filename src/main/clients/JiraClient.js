import JiraApi from 'jira-client';

/**
 * Create a new JIRA issue.
 * For more information, see the link provided below:
 * https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post)
 *
 * @param {String} jiraHost
 *    The host to connect to for the jira instance. Ex: jira.somehost.com
 * @param {Object} jiraCredential
 *    The jira credential object consisting of user name and password to authenticate requests.
 * @param {Object} fieldValues
 *    The object containing the fields for creating issue. These fields are wrapped in 'fields' key before calling jira api.
 *    For more information refer to fields section in the above mentioned JIRA document.
 * @returns {Object} The response data for the created issue.
 */
const createIssue = async (jiraHost, jiraCredential, fieldValues) => {
  try {
    const jira = new JiraApi({
      protocol: 'https',
      host: jiraHost,
      username: jiraCredential.username,
      password: jiraCredential.password,
      apiVersion: '2',
      strictSSL: true,
    });

    const issueJSON = { fields: fieldValues };
    const createIssueResponse = await jira.addNewIssue(issueJSON);
    return createIssueResponse;
  } catch (error) {
    const errorMessage = `Error while creating JIRA issue: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error('Failed to create Jira!');
  }
};

export default { createIssue };
