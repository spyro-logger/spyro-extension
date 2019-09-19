import queryString from 'query-string';
import SplunkClient from '../SplunkClient';

async function loadJobDetails(searchId) {
  console.log('MY SID: ' + searchId);
  let splunkJobDetailsRetriever = SplunkClient.splunkJobDetailsRetriever();

  //TODO: Place holders until we read splunkAPIURL, splunkApp and auth
  const splunkAPIURL = '';
  const splunkApp = '';
  let credential;
  credential.username = 'xxx';
  credential.password = 'xxx';

  splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId, credential }).then((response) => {
    //TODO: Filter reply to return fields needed eventCount, eventContent, sid, searchTimeRange and searchString

    console.log('RESPONSE: ' + JSON.stringify(response));
  });
}

export default class {
  static loadJobDetailsFromURL = (url) => {
    let sid = queryString.parse(url).sid;
    return loadJobDetails(sid);
  };
}
