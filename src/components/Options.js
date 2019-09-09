import React from 'react';
import Container from '@material-ui/core/Container';

import { SettingsContextProvider } from './SettingsContext';
import OptionsForm from './OptionsForm';

const Options = () => {
  return (
    <main>
      <SettingsContextProvider>
        {(settingsContext) => {
          const { actions, configuration, statuses } = settingsContext;
          return (
            <Container>
              <h1>Options</h1>
              <OptionsForm
                configuration={configuration}
                statuses={statuses}
                onSave={(formValues) => {
                  actions.setSettingsRepositoryUrl(formValues.settingsRepositoryUrl);
                }}
              />
            </Container>
          );
        }}
      </SettingsContextProvider>
    </main>
  );
};

export default Options;
