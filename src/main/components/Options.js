import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { SettingsContextProvider } from './SettingsContext';
import OptionsForm from './OptionsForm';
import CredentialsTable from './CredentialsTable';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

const useStyles = makeStyles((theme) => ({
  optionsFormContainer: {
    marginBottom: theme.spacing(4),
  },
  noEntriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  noEntriesIcon: {
    height: 50,
    width: 'auto',
  },
}));

const Options = () => {
  const classes = useStyles();

  return (
    <main>
      <SettingsContextProvider>
        {(settingsContext) => {
          const { actions, configuration, statuses, settings } = settingsContext;
          const checkIfThereAreInstances = (type) =>
            settings.shared[type] && settings.shared[type].instances && settings.shared[type].instances.length > 0;
          const shouldShowCredentialsSection =
            settings && settings.shared && (checkIfThereAreInstances('jira') || checkIfThereAreInstances('splunk'));
          return (
            <Container>
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
                  <CredentialsTable sharedInstancesConfiguration={settings.shared} />
                </>
              ) : (
                <Paper className={classes.noEntriesContainer}>
                  <DescriptionOutlinedIcon className={classes.noEntriesIcon} />
                  <Typography variant="h5" component="h2">
                    No Jira or Splunk instances were found in the specified settings URL
                  </Typography>
                  <Typography variant="h6" component="h3">
                    For more information, see the "External Settings Structure" documentation
                  </Typography>
                </Paper>
              )}
            </Container>
          );
        }}
      </SettingsContextProvider>
    </main>
  );
};

export default Options;
