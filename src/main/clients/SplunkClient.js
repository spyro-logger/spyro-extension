import axios from 'axios';
import moment from 'moment';

const getNodeValueByNodeName = (parentNode, nodeName) => {
  const nodes = parentNode.getElementsByTagNameNS('*', 'key');
  // Looping over HTMLCollection, which doesn't have typical array functions
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].getAttribute('name') === nodeName) {
      return nodes[i].childNodes[0].nodeValue;
    }
  }

  return undefined;
};

const getFormattedDateTime = (xmlDoc, nodeName) => {
  const startDateTime = getNodeValueByNodeName(xmlDoc, nodeName);
  return moment(startDateTime).format('MM/DD/YY h:mm:ss A');
};

const populateSearchRange = (xmlDoc) => {
  return `${getFormattedDateTime(xmlDoc, 'earliestTime')} to ${getFormattedDateTime(xmlDoc, 'latestTime')}`;
};

const populateRequiredJobDetails = (jobBySIDResponse, jobFirstEventResponse, jobSummaryResponse) => {
  const jobDetails = {};

  const jobFields = jobSummaryResponse.data.fields;

  // eslint-disable-next-line no-underscore-dangle
  jobDetails.stackTrace = jobFirstEventResponse.data.results[0]._raw;
  const xmlDoc = new DOMParser().parseFromString(jobBySIDResponse.data, 'text/xml');
  jobDetails.occurences = getNodeValueByNodeName(xmlDoc, 'eventCount');
  jobDetails.searchRange = populateSearchRange(xmlDoc);
  jobDetails.searchString = getNodeValueByNodeName(xmlDoc, 'custom.search');
  jobDetails.fields = [...Object.entries(jobFields)]
    .map(([key, value]) => {
      return {
        key,
        value: value.modes.map((mode) => `${mode.value} (${mode.count})`).join(', '),
      };
    })
    .reduce((accumulator, entry) => {
      return {
        ...accumulator,
        [entry.key]: entry.value,
      };
    }, []);

  return jobDetails;
};

const splunkJobDetailsRetriever = () => ({ splunkAPIURL, splunkApp, searchId, credential }) => {
  const retrieveJobBySIDUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs/${searchId}`;
  const retrieveJobSummaryUrl = `${retrieveJobBySIDUrl}/summary?output_mode=json`;
  const retrieveJobFirstEventUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs/${searchId}/events?count=1&f=_raw&output_mode=json`;

  const auth = { username: credential.username, password: credential.password };

  return new Promise((resolve, reject) => {
    axios
      .all([
        axios.get(retrieveJobBySIDUrl, {
          auth,
        }),
        axios.get(retrieveJobFirstEventUrl, {
          auth,
        }),
        axios.get(retrieveJobSummaryUrl, {
          auth,
        }),
      ])
      .then(
        axios.spread((jobBySIDResponse, jobFirstEventResponse, jobSummary) => {
          const populatedJobDetails = populateRequiredJobDetails(jobBySIDResponse, jobFirstEventResponse, jobSummary);
          resolve(populatedJobDetails);
        }),
      )
      .catch((error) => {
        const errorMessage = `Error while retrieving splunk job details: ${error}`;
        // eslint-disable-next-line no-console
        console.error(errorMessage);
        reject(new Error(errorMessage));
      });
  });
};

const createEventType = async (credential, splunkAPIURL, splunkApp, jiraIdentifier, searchString) => {
  try {
    const createEventTypeUrl = `${splunkAPIURL}/${credential.username}/${splunkApp}/saved/eventtypes`;
    const basicAuth = `Basic ${btoa(`${credential.username}:${credential.password}`)}`;

    const formData = `name=${encodeURIComponent(jiraIdentifier)}&priority=5&disabled=0&description=${encodeURIComponent(
      jiraIdentifier,
    )}&search=${searchString}`;

    const headers = { 'Content-type': 'application/x-www-form-urlencoded', Authorization: basicAuth };

    return await axios.post(createEventTypeUrl, formData, { headers });
  } catch (error) {
    const errorMessage = `Error while creating event type: ${error}`;
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    throw new Error('Failed to create event type');
  }
};

const updateEventTypePermission = async (credential, splunkAPIURL, splunkApp, jiraIdentifier) => {
  try {
    const updateEventTypeUrl = `${splunkAPIURL}/${credential.username}/${splunkApp}/saved/eventtypes/${jiraIdentifier}/acl`;

    const basicAuth = `Basic ${btoa(`${credential.username}:${credential.password}`)}`;

    const formData = `perms.read=${encodeURIComponent('*')}&perms.write=${encodeURIComponent(
      '*',
    )}&sharing=app&owner=${encodeURIComponent(credential.username)}`;

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
