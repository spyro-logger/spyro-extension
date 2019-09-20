import axios from 'axios';

const splunkJobDetailsRetriever = () => ({ splunkAPIURL, splunkApp, searchId, credential }) => {
  const retrieveJobBySIDUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs?sid=${searchId}`;
  const retrieveJobFirstEventUrl = `${splunkAPIURL}/nobody/${splunkApp}/search/jobs/${searchId}/events?count=1&f=_raw`;
  const headers = {
    Accept: 'application/json',
  };

  const auth = { username: credential.username, password: credential.password };

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
      axios.spread((jobBySIDResponse, jobFirstEventResponse) => ({
        jobBySIDResponse: jobBySIDResponse.data,
        jobFirstEventResponse: jobFirstEventResponse.data,
      })),
    )
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(`Error while retrieving splunk job details: ${error}`);
    });
};

export default { splunkJobDetailsRetriever };
