import queryString from 'query-string';
import SplunkClient from '../SplunkClient';

async function loadJobDetails(searchId, splunkAPIURL, splunkApp, credential) {
  const splunkJobDetailsRetriever = SplunkClient.splunkJobDetailsRetriever();
  const jobDetails = await splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId, credential });
  return jobDetails;
}

export default class {
  static async loadJobDetailsFromURL(url, splunkAPIURL, splunkApp, credential) {
    const { sid } = queryString.parse(url);

    const jobDetails = await loadJobDetails(sid, splunkAPIURL, splunkApp, credential);
    return jobDetails;
  }
}
