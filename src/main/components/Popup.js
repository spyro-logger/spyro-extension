import React, { useState } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { defaultBackgroundColor } from '../styleVariables';
import Header from './Header';
import { SettingsContextProvider } from './SettingsContext';
import TemplateSelector from './TemplateSelector';
import SplunkJobLoader from '../utils/SplunkJobLoader';
import getCurrentSplunkUrl from '../utils/getCurrentSplunkUrl';
import Credentials from '../utils/Credentials';
import JiraSubmitter from './JiraSubmitter';
import InfoPaper from './InfoPaper';

const useStyles = makeStyles((theme) => ({
  page: {
    width: 700,
    height: 600,
    backgroundColor: defaultBackgroundColor,
  },
  bannerContainer: {
    marginBottom: theme.spacing(3),
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

function Popup() {
  const [indexOfSelectedTemplate, setIndexOfSelectedTemplate] = useState(0);
  const [splunkSearchDetails, setSplunkSearchDetails] = useState(null);
  const [error, setError] = useState(null);
  const classes = useStyles();

  async function loadJobDetailsFromURL(selectedTemplate, applicationSettings) {
    getCurrentSplunkUrl().then(async (url) => {
      const { splunkInstance, splunkApp } = selectedTemplate;
      Credentials.getEntryByKey(splunkInstance).then((credential) => {
        const splunkAPIURL = getSplunkRestUrl(applicationSettings.shared.splunk.instances, splunkInstance);

        if (!splunkAPIURL) {
          return Promise.reject(new Error('No Splunk API URL specified'));
        }

        return SplunkJobLoader.loadJobDetailsFromURL(url, splunkAPIURL, splunkApp, credential)
          .then((response) => {
            const details = {
              splunk_event_count: response.occurences,
              splunk_event_content: response.stackTrace,
              splunk_search_range: response.searchRange,
              splunk_search_string: response.searchString,
              splunk_search_url_without_sid: 'http://splunk.com',
              jira_instance_credentials_username: 'user1',
            };
            setSplunkSearchDetails(details);
          })
          .catch(() => {
            setError('Unable to retrieve Splunk details');
          });
      });
    });
  }

  const handleTemplateSelection = (indexOfNewlySelectedTemplate) =>
    setIndexOfSelectedTemplate(indexOfNewlySelectedTemplate);

  const onJIRAIssueCreation = (response) => {
    // eslint-disable-next-line no-console
    console.log(`Inside POP-UP onJIRAIssueCreation: ${JSON.stringify(response)}`);
    // Add code to associate jira to splunk event id here
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" m={0} p={0} bgcolor="background.paper">
      <Box className={classes.page}>
        <Box className={classes.bannerContainer}>
          <Header />
        </Box>
        <SettingsContextProvider>
          {({ settings }) => {
            if (!settings || !settings.issueTemplates) {
              return (
                <InfoPaper
                  Icon={DescriptionOutlinedIcon}
                  header="Navigate to the Options of this extension and provide a settings URL."
                  subheader='For more information, see the "External Settings" documentation'
                />
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
                  <InfoPaper
                    Icon={ErrorOutlineIcon}
                    header="Unable to retrieve Splunk details."
                    subheader="Double check settings and try again."
                  />
                )}
                {!error && splunkSearchDetails && (
                  <JiraSubmitter
                    selectedTemplate={settings.issueTemplates[indexOfSelectedTemplate]}
                    jiraInstances={settings.shared.jira.instances}
                    splunkSearchDetails={splunkSearchDetails}
                    onJIRAIssueCreation={onJIRAIssueCreation}
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
