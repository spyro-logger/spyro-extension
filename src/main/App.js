import './App.css';
import 'typeface-roboto';

import React from 'react';

import queryString from 'query-string';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { lightGreen, red } from '@material-ui/core/colors';

import Popup from './components/Popup';
import Options from './components/Options';

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: red,
  },
});

function App() {
  return <ThemeProvider theme={theme}>{getPageToRender()}</ThemeProvider>;
}

function getPageToRender() {
  let page = queryString.parse(window.location.search).page;
  switch (page) {
    case 'Options':
      return <Options />;
    case 'Popup':
    default:
      return <Popup />;
  }
}

export default App;
