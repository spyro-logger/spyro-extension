import React from 'react';

import { Box } from '@material-ui/core';

import Header from './Header';
import { SettingsContextProvider } from './SettingsContext';

function Popup() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" m={0} p={0} bgcolor="background.paper">
      {/* There's no good reason for the 575 except that it was causing a scroll bar to use 600 px */}
      <Box width="800px" height="575px">
        <Header />
        <SettingsContextProvider>
          {({ settings }) => <pre>{JSON.stringify(settings, null, 2)}</pre>}
        </SettingsContextProvider>
      </Box>
    </Box>
  );
}

export default Popup;
