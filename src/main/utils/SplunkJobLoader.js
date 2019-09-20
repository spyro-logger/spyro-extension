import queryString from 'query-string';
import SplunkClient from '../SplunkClient';

async function loadJobDetails(searchId) {
  // eslint-disable-next-line no-console
  console.log(`MY SID: ${searchId}`);
  const splunkJobDetailsRetriever = SplunkClient.splunkJobDetailsRetriever();

  // TODO: Place holders until we read splunkAPIURL, splunkApp and auth
  const splunkAPIURL = '';
  const splunkApp = '';
  const credential = {
    username: 'xxx',
    password: 'xxx',
  };

  splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId, credential }).then((response) => {
    // TODO: Filter reply to return fields needed eventCount, eventContent, sid, searchTimeRange and searchString

    // eslint-disable-next-line no-console
    console.log(`RESPONSE: ${JSON.stringify(response)}`);
  });
}

export default class {
  static loadJobDetailsFromURL(url) {
    const { sid } = queryString.parse(url);
    return loadJobDetails(sid);
  }
}
