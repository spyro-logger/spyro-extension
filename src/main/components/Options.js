import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { SettingsContextProvider } from './SettingsContext';
import OptionsForm from './OptionsForm';
import CredentialsTable from './CredentialsTable';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  optionsFormContainer: {
    marginBottom: theme.spacing(4),
  },
}));

const Options = () => {
  const classes = useStyles();

  return (
    <main>
      <SettingsContextProvider>
        {(settingsContext) => {
          const { actions, configuration, statuses } = settingsContext;
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
                />
              </div>
              <Typography variant="h5" component="h2" gutterBottom>
                Credentials
              </Typography>
              <CredentialsTable />
            </Container>
          );
        }}
      </SettingsContextProvider>
    </main>
  );
};

export default Options;
