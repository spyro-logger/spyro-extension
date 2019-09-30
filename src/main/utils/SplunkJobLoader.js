import queryString from 'query-string';
import SplunkClient from '../SplunkClient';

async function loadJobDetails(searchId, splunkAPIURL, splunkApp, credential) {
  const splunkJobDetailsRetriever = SplunkClient.splunkJobDetailsRetriever();
  return splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId, credential });
}

export default class {
  static async loadJobDetailsFromURL(url, splunkAPIURL, splunkApp, credential) {
    const { sid } = queryString.parse(url);

    return loadJobDetails(sid, splunkAPIURL, splunkApp, credential);
  }
}
