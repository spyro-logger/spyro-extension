import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { SettingsContextProvider } from './SettingsContext';
import OptionsForm from './OptionsForm';
import CredentialsTable from './CredentialsTable';
import { defaultBackgroundColor } from '../styleVariables';
import InfoPaper from './InfoPaper';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: defaultBackgroundColor,
    paddingTop: theme.spacing(3),
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
  },
  optionsFormContainer: {
    marginBottom: theme.spacing(4),
  },
}));

const Options = () => {
  const classes = useStyles();

  return (
    <main className={classes.page}>
      <SettingsContextProvider>
        {(settingsContext) => {
          const { actions, configuration, statuses, settings } = settingsContext;
          const checkIfThereAreInstances = (type) =>
            settings.shared[type] && settings.shared[type].instances && settings.shared[type].instances.length > 0;
          const shouldShowCredentialsSection =
            settings && settings.shared && (checkIfThereAreInstances('jira') || checkIfThereAreInstances('splunk'));
          return (
            <Container maxWidth="md">
              <Typography variant="h4" component="h1" gutterBottom>
                Options
              </Typography>
              <div className={classes.optionsFormContainer}>
                <OptionsForm
                  configuration={configuration}
                  statuses={statuses}
                  onSave={(formValues) => {
                    actions.setSettingsRepositoryUrl(formValues.settingsRepositoryUrl);
                  }}
                  settings={settings}
                />
              </div>
              {shouldShowCredentialsSection ? (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Credentials
                  </Typography>
                  <CredentialsTable
                    sharedInstancesConfiguration={settings.shared}
                    onCredentialRemoveRequest={(indexOfCredentialToRemove) => {
                      actions.removeCredentialEntry(indexOfCredentialToRemove);
                    }}
                  />
                </>
              ) : (
                <InfoPaper
                  Icon={DescriptionOutlinedIcon}
                  header="No Jira or Splunk instances were found in the specified settings URL"
                  subheader='For more information, see the "External Settings Structure" documentation'
                />
              )}
            </Container>
          );
        }}
      </SettingsContextProvider>
    </main>
  );
};

export default Options;
