import queryString from 'query-string';
import ServiceFactory from '../service-factory';

async function loadJobDetails(searchId) {
  console.log('MY SID: ' + searchId);
  var splunkJobDetailsRetriever = ServiceFactory.splunkJobDetailsRetriever();

  //TODO: Place holders until we read splunkAPIURL, splunkApp and auth
  var splunkAPIURL = '';
  var splunkApp = '';
  const auth = { username: 'xxx', password: 'xxx' };
  splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId, auth }).then((response) => {
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
