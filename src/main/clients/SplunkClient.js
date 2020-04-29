import axios from 'axios';

const splunkJobDetailsRetriever = () => ({ spyroServerBaseUrl, splunkAPIURL, splunkApp, searchId, credential }) => {
  const retrieveJobDetailsUrl = `${spyroServerBaseUrl}/splunk/jobDetails?splunkAPIURL=${splunkAPIURL}&splunkApp=${splunkApp}&searchId=${searchId}`;

  const basicAuth = `Basic ${btoa(`${credential.username}:${credential.password}`)}`;
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: basicAuth };
  return axios.get(retrieveJobDetailsUrl, { headers }).catch((error) => {
    const errorMessage = `Error while retrieving splunk job details: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error(error);
  });
};

const createEventType = async (
  spyroServerBaseUrl,
  credential,
  splunkAPIURL,
  splunkApp,
  jiraIdentifier,
  searchString,
) => {
  try {
    const createEventTypeUrl = `${spyroServerBaseUrl}/splunk/event`;
    const basicAuth = `Basic ${btoa(`${credential.username}:${credential.password}`)}`;
    const formData = `splunkAPIURL=${splunkAPIURL}&searchString=${searchString}&splunkApp=${splunkApp}&jiraIdentifier=${jiraIdentifier}`;

    const headers = {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: basicAuth,
    };

    return await axios.post(createEventTypeUrl, formData, { headers });
  } catch (error) {
    const errorMessage = `Error while creating event type: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error('Failed to create event type');
  }
};

const updateEventTypePermission = async (spyroServerBaseUrl, credential, splunkAPIURL, splunkApp, jiraIdentifier) => {
  try {
    const updateEventTypeUrl = `${spyroServerBaseUrl}/splunk/event/permission`;

    const basicAuth = `Basic ${btoa(`${credential.username}:${credential.password}`)}`;

    const formData = `splunkAPIURL=${splunkAPIURL}&splunkApp=${splunkApp}&jiraIdentifier=${jiraIdentifier}&owner=${credential.username}`;

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: basicAuth };

    return await axios.post(updateEventTypeUrl, formData, { headers });
  } catch (error) {
    const errorMessage = `Failed to update Event Type permissions: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error('updating event type permission failed!');
  }
};

export default { splunkJobDetailsRetriever, createEventType, updateEventTypePermission };
