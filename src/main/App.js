import './App.css';
import 'typeface-roboto';

import React from 'react';

import queryString from 'query-string';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { lightGreen, red } from '@material-ui/core/colors';
import { SnackbarProvider } from 'notistack';

import Popup from './components/Popup';
import Options from './components/Options';

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: red,
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

function getPageToRender() {
  const { page } = queryString.parse(window.location.search);
  switch (page) {
    case 'Options':
      return <Options />;
    case 'Popup':
    default:
      return (
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Popup />
        </SnackbarProvider>
      );
  }
}

function App() {
  return <ThemeProvider theme={theme}>{getPageToRender()}</ThemeProvider>;
}

export default App;
