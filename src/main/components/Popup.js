import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import Typography from '@material-ui/core/Typography';

import Header from './Header';
import { SettingsContextProvider } from './SettingsContext';
import TemplateSelector from './TemplateSelector';

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    marginBottom: theme.spacing(3),
  },
  noEntriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  noEntriesIcon: {
    height: 50,
    width: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

function Popup() {
  const [indexOfSelectedTemplate, setIndexOfSelectedTemplate] = useState(0);
  const classes = useStyles();

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
                <Paper className={classes.noEntriesContainer}>
                  <DescriptionOutlinedIcon className={classes.noEntriesIcon} />
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
              <>
                <TemplateSelector
                  issueTemplates={settings.issueTemplates}
                  indexOfSelectedTemplate={indexOfSelectedTemplate}
                  onSelectionChange={handleTemplateSelection}
                />
                {settings && settings.issueTemplates && settings.issueTemplates.length > 0 && (
                  <pre>{JSON.stringify(settings.issueTemplates[indexOfSelectedTemplate], null, 2)}</pre>
                )}
              </>
            );
          }}
        </SettingsContextProvider>
      </Box>
    </Box>
  );
}

export default Popup;
