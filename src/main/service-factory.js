import axios from 'axios';

const splunkJobDetailsRetriever = () => ({ splunkAPIURL, splunkApp, searchId, auth }) => {
  const retrieveJobBySIDUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs?sid=${searchId}`;
  const retrieveJobFirstEventUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs/${searchId}/events?count=1&f=_raw`;
  const headers = {
    Accept: 'application/json',
  };

  return axios
    .all([
      axios.get(retrieveJobBySIDUrl, {
        headers,
        auth,
      }),
      axios.get(retrieveJobFirstEventUrl, {
        headers,
        auth,
      }),
    ])
    .then(
      axios.spread(function(jobBySIDResponse, jobFirstEventResponse) {
        return { jobBySIDResponse: jobBySIDResponse.data, jobFirstEventResponse: jobFirstEventResponse.data };
      }),
    )
    .catch((error) => {
      console.log('Error while retrieving splunk job details: ' + error);
    });
};

export default { splunkJobDetailsRetriever };
