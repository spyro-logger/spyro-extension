import React, { useState } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';

import Header from './Header';
import { SettingsContextProvider } from './SettingsContext';
import TemplateSelector from './TemplateSelector';
import SplunkJobLoader from '../utils/SplunkJobLoader';
import getCurrentSplunkUrl from '../utils/getCurrentSplunkUrl';
import Credentials from '../utils/Credentials';
import JiraSubmitter from './JiraSubmitter';

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    marginBottom: theme.spacing(3),
  },
  notificationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  notificationContainerIcon: {
    height: 50,
    width: 'auto',
    marginBottom: theme.spacing(2),
  },
  mainContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  populateButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

function getSplunkRestUrl(splunkInstances, key) {
  const selectedInstance = splunkInstances.find((instance) => instance.key === key);

  if (selectedInstance) {
    return selectedInstance.restAPIURL;
  }

  return undefined;
}

// TODO: Pull injected values from splunkSearchDetails and remove sampleValues
const sampleValues = {
  splunk_event_count: '52',
  splunk_event_content: 'Some error occurred',
  splunk_search_range: 'Date 1 to Date 2',
  splunk_search_string: 'INDEX=SPLUNK',
  splunk_search_url_without_sid: 'http://splunk.com',
  settings_current_user_id: 'user1',
};

function Popup() {
  const [indexOfSelectedTemplate, setIndexOfSelectedTemplate] = useState(0);
  const [splunkSearchDetails, setSplunkSearchDetails] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();

  async function loadJobDetailsFromURL(selectedTemplate, applicationSettings) {
    getCurrentSplunkUrl().then(async (url) => {
      const jiraInstance = selectedTemplate['jira-instance'];
      const splunkInstance = selectedTemplate['splunk-instance'];
      Credentials.getEntryByKey(jiraInstance).then((credential) => {
        const splunkAPIURL = getSplunkRestUrl(applicationSettings.shared.splunk.instances, splunkInstance);

        if (!splunkAPIURL) {
          return Promise.reject(new Error('No Splunk API URL specified'));
        }

        const splunkApp = '';

        return SplunkJobLoader.loadJobDetailsFromURL(url, splunkAPIURL, splunkApp, credential)
          .then(() => {
            setSplunkSearchDetails(sampleValues); // TODO: Replace with response when response works
          })
          .catch(() => {
            setError('Unable to retrieve Splunk details');
          });
      });
    });
  }

  const handleTemplateSelection = (indexOfNewlySelectedTemplate) =>
    setIndexOfSelectedTemplate(indexOfNewlySelectedTemplate);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" m={0} p={0} bgcolor="background.paper">
      {/* There's no good reason for the 575 except that it was causing a scroll bar to use 600 px */}
      <Box width="800px" height="575px">
        <Box className={classes.bannerContainer}>
          <Header />
        </Box>
        <SettingsContextProvider>
          {({ settings }) => {
            if (!settings || !settings.issueTemplates) {
              return (
                <Paper className={classes.notificationContainer}>
                  <DescriptionOutlinedIcon className={classes.notificationContainerIcon} />
                  <Typography variant="h5" component="h2">
                    Navigate to the Options of this extension and provide a settings URL.
                  </Typography>
                  <Typography variant="h6" component="h3">
                    For more information, see the &quot;External Settings&quot; documentation
                  </Typography>
                </Paper>
              );
            }

            return (
              <div className={classes.mainContainer}>
                <TemplateSelector
                  issueTemplates={settings.issueTemplates}
                  indexOfSelectedTemplate={indexOfSelectedTemplate}
                  onSelectionChange={handleTemplateSelection}
                />
                <Button
                  className={classes.populateButton}
                  variant="contained"
                  color="primary"
                  onClick={() => loadJobDetailsFromURL(settings.issueTemplates[indexOfSelectedTemplate], settings)}
                >
                  Populate From Splunk
                </Button>
                {error && (
                  <>
                    <Paper className={classes.notificationContainer}>
                      <ErrorOutlineIcon className={classes.notificationContainerIcon} />
                      <Typography variant="h5" component="h2">
                        Unable to retrieve Splunk details.
                      </Typography>
                      <Typography variant="h6" component="h3">
                        Double check settings and try again.
                      </Typography>
                    </Paper>
                  </>
                )}
                {!error && splunkSearchDetails && (
                  <JiraSubmitter
                    selectedTemplate={settings.issueTemplates[indexOfSelectedTemplate]}
                    splunkSearchDetails={splunkSearchDetails}
                  />
                )}
              </div>
            );
          }}
        </SettingsContextProvider>
      </Box>
    </Box>
  );
}

export default Popup;
