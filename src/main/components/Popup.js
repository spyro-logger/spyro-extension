import React, { useState } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';

import { defaultBackgroundColor } from '../styleVariables';
import Header from './Header';
import { SettingsContextProvider } from './SettingsContext';
import TemplateSelector from './TemplateSelector';
import getCurrentSplunkUrl from '../utils/getCurrentSplunkUrl';
import Credentials from '../utils/Credentials';
import JiraSubmitter from './JiraSubmitter';
import InfoPaper from './InfoPaper';
import SplunkClient from '../clients/SplunkClient';
import JiraClient from '../clients/JiraClient';

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
  circularProgress: {
    marginLeft: theme.spacing(1),
  },
}));

function getSplunkRestUrl(splunkInstances, key) {
  const selectedInstance = splunkInstances.find((instance) => instance.key === key);

  if (selectedInstance) {
    return selectedInstance.restAPIURL;
  }

  return undefined;
}

function getJiraHost(jiraInstances, key) {
  const selectedInstance = jiraInstances.find((instance) => instance.key === key);

  if (selectedInstance) {
    const currentHost =
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? selectedInstance.devHost
        : selectedInstance.host;

    return currentHost;
  }

  return undefined;
}

const showEnqueueSnackbar = (message, variant, enqueueSnackbar) =>
  enqueueSnackbar(
    message,
    { variant },
    {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    },
  );

function openCreatedIssue(jiraHost, jiraIdentifier) {
  const jiraURL = `https://${jiraHost}/browse/${jiraIdentifier}`;
  window.chrome.tabs.create({ url: jiraURL, active: false, selected: false });
}

async function createAndUpdateEventType(
  selectedTemplate,
  applicationSettings,
  searchString,
  jiraIdentifier,
  enqueueSnackbar,
) {
  const { splunkInstance, splunkApp } = selectedTemplate;
  const credential = await Credentials.getEntryByKey(splunkInstance);
  const splunkAPIURL = getSplunkRestUrl(applicationSettings.shared.splunk.instances, splunkInstance, 'restAPIURL');

  if (!splunkAPIURL) {
    return Promise.reject(new Error('No Splunk API URL specified'));
  }

  if (!splunkApp) {
    return Promise.reject(new Error('Splunk application is not specified'));
  }

  await SplunkClient.createEventType(credential, splunkAPIURL, splunkApp, jiraIdentifier, searchString);
  showEnqueueSnackbar('New event created successfully!', 'success', enqueueSnackbar);
  return SplunkClient.updateEventTypePermission(credential, splunkAPIURL, splunkApp, jiraIdentifier);
}

function Popup() {
  const [indexOfSelectedTemplate, setIndexOfSelectedTemplate] = useState(0);
  const [splunkSearchDetails, setSplunkSearchDetails] = useState(null);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [splunkRetrievalInProgress, setSplunkRetrievalInProgress] = useState(false);
  const [splunkRetrievalSuccess, setSplunkRetrievalSuccess] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  async function loadJobDetailsFromURL(selectedTemplate, applicationSettings) {
    setSplunkRetrievalInProgress(true);
    getCurrentSplunkUrl().then(async (url) => {
      const { splunkInstance, splunkApp } = selectedTemplate;
      Credentials.getEntryByKey(splunkInstance).then((credential) => {
        const splunkAPIURL = getSplunkRestUrl(applicationSettings.shared.splunk.instances, splunkInstance);

        if (!splunkAPIURL) {
          return Promise.reject(new Error('No Splunk API URL specified'));
        }

        if (!splunkApp) {
          return Promise.reject(new Error('Splunk application is not specified'));
        }

        const { sid } = queryString.parse(url);
        const splunkJobDetailsRetriever = SplunkClient.splunkJobDetailsRetriever();

        return splunkJobDetailsRetriever({ splunkAPIURL, splunkApp, searchId: sid, credential })
          .then((response) => {
            const jobSummaryFields = [...Object.entries(response.fields)]
              .map(([key, value]) => [`splunk:fields:${key}`, value])
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

            const details = {
              splunk_event_count: response.occurences,
              splunk_event_content: response.stackTrace,
              splunk_search_range: response.searchRange,
              splunk_search_string: response.searchString,
              splunk_search_url_without_sid: 'http://splunk.com',
              jira_instance_credentials_username: 'user1',
              ...jobSummaryFields,
            };
            setSplunkSearchDetails(details);
            setSplunkRetrievalInProgress(false);
            setSplunkRetrievalSuccess(true);
          })
          .catch(() => {
            setSplunkRetrievalInProgress(false);
            setError('Unable to retrieve Splunk details');
            setSplunkRetrievalSuccess(false);
          });
      });
    });
  }

  const handleTemplateSelection = (indexOfNewlySelectedTemplate) =>
    setIndexOfSelectedTemplate(indexOfNewlySelectedTemplate);

  async function onSubmit(populatedFieldValues, selectedTemplate, applicationSettings, searchString) {
    const { jiraInstance } = selectedTemplate;
    const jiraCredential = await Credentials.getEntryByKey(jiraInstance);
    const jiraHost = getJiraHost(applicationSettings.shared.jira.instances, jiraInstance);

    if (!jiraHost) {
      return Promise.reject(new Error('Jira host is not specified'));
    }

    setSubmissionInProgress(true);

    try {
      const createIssueResponse = await JiraClient.createIssue(jiraHost, jiraCredential, populatedFieldValues);
      showEnqueueSnackbar('JIRA created successfully!', 'success', enqueueSnackbar);
      const jiraIdentifier = createIssueResponse.key;
      openCreatedIssue(jiraHost, jiraIdentifier);

      await createAndUpdateEventType(
        selectedTemplate,
        applicationSettings,
        searchString,
        jiraIdentifier,
        enqueueSnackbar,
      );
      showEnqueueSnackbar('Event permission updated!', 'success', enqueueSnackbar);
    } catch (submissionError) {
      showEnqueueSnackbar(submissionError.message, 'error', enqueueSnackbar);
    } finally {
      setSubmissionInProgress(false);
    }
    return true;
  }

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
                  disabled={splunkRetrievalInProgress || splunkRetrievalSuccess}
                  onClick={() => loadJobDetailsFromURL(settings.issueTemplates[indexOfSelectedTemplate], settings)}
                >
                  {splunkRetrievalInProgress ? (
                    <div>
                      Populating Template
                      <CircularProgress className={classes.circularProgress} color="secondary" size={22} />
                    </div>
                  ) : (
                    'Populate Template'
                  )}
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
                    onSubmit={(populatedFieldValues) => {
                      onSubmit(
                        populatedFieldValues,
                        settings.issueTemplates[indexOfSelectedTemplate],
                        settings,
                        splunkSearchDetails.splunk_search_string,
                      );
                    }}
                    splunkSearchDetails={splunkSearchDetails}
                    submissionInProgress={submissionInProgress}
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
