import axios from 'axios';
import moment from 'moment';

const getNodeValueByNodeName = (parentNode, nodeName) => {
  const nodes = parentNode.getElementsByTagNameNS('*', 'key');

  const selectedNode = nodes.find((node) => node.getAttribute('name') === nodeName);
  return selectedNode ? selectedNode.childNodes[0].nodeValue : undefined;
};

const getFormattedDateTime = (xmlDoc, nodeName) => {
  const startDateTime = getNodeValueByNodeName(xmlDoc, nodeName);
  return moment(startDateTime).format('MM/DD/YY h:mm:ss A');
};

const populateSearchRange = (xmlDoc) => {
  return `${getFormattedDateTime(xmlDoc, 'earliestTime')} to ${getFormattedDateTime(xmlDoc, 'latestTime')}`;
};

const populateRequiredJobDetails = (jobBySIDResponse, jobFirstEventResponse) => {
  const jobDetails = {};

  // eslint-disable-next-line no-underscore-dangle
  jobDetails.stackTrace = jobFirstEventResponse.data.results[0]._raw;
  const xmlDoc = new DOMParser().parseFromString(jobBySIDResponse.data, 'text/xml');
  jobDetails.occurences = getNodeValueByNodeName(xmlDoc, 'eventCount');
  jobDetails.searchRange = populateSearchRange(xmlDoc);
  jobDetails.searchString = getNodeValueByNodeName(xmlDoc, 'custom.search');

  return jobDetails;
};

const splunkJobDetailsRetriever = () => ({ splunkAPIURL, splunkApp, searchId, credential }) => {
  const retrieveJobBySIDUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs/${searchId}`;
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
      ])
      .then(
        axios.spread((jobBySIDResponse, jobFirstEventResponse) => {
          return populateRequiredJobDetails(jobBySIDResponse, jobFirstEventResponse);
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

export default { splunkJobDetailsRetriever };
