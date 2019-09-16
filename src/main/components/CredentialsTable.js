import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import CredentialsModificationDialog from './CredentialsModificationDialog';
import Typography from '@material-ui/core/Typography';
import { SettingsContext } from './SettingsContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 100,
  },
  jiraInstanceChip: {
    marginRight: theme.spacing(1),
  },
  addCredentialsButton: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
  noEntriesContainer: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesIcon: {
    height: 50,
    width: 'auto',
  },
}));

const CredentialsTable = (props) => {
  const { sharedInstancesConfiguration } = props;
  const classes = useStyles();
  const [isCredentialsModificationDialogOpen, setIsCredentialsModificationDialogOpen] = useState(false);
  const { credentials, actions } = useContext(SettingsContext);

  return (
    <>
      {credentials.length === 0 ? (
        <Paper className={classes.noEntriesContainer}>
          <DescriptionOutlinedIcon className={classes.noEntriesIcon} />
          <Typography variant="h5" component="h2">
            No Credentials Saved
          </Typography>
          <Typography variant="h6" component="h3">
            Click "Add Credentials" to get started
          </Typography>
        </Paper>
      ) : (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Credential Username</TableCell>
                <TableCell>Instance(s) Associated To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credentials.map((credentialEntry, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {credentialEntry.username}
                  </TableCell>
                  <TableCell>
                    {credentialEntry.associatedTo.map((instance) => (
                      <Chip
                        label={instance}
                        key={instance}
                        variant="outlined"
                        size="small"
                        className={classes.jiraInstanceChip}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <CredentialsModificationDialog
        isOpen={isCredentialsModificationDialogOpen}
        onCancel={() => setIsCredentialsModificationDialogOpen(false)}
        onSave={(values) => {
          console.log(values);
          actions.addCredentialEntry({
            username: values.username,
            password: values.password,
            associatedTo: [...values.selectedJiraInstances, ...values.selectedSplunkInstances],
          });
          setIsCredentialsModificationDialogOpen(false);
        }}
        sharedInstancesConfiguration={sharedInstancesConfiguration}
      />
      <Button onClick={() => setIsCredentialsModificationDialogOpen(true)} className={classes.addCredentialsButton}>
        <AddIcon />
        Add Credential
      </Button>
    </>
  );
};

const SharedInstanceShape = {
  key: PropTypes.string.isRequired,
};

CredentialsTable.propTypes = {
  sharedInstancesConfiguration: PropTypes.shape({
    splunk: PropTypes.shape({
      instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
    }),
    jira: PropTypes.shape({
      instances: PropTypes.arrayOf(PropTypes.shape(SharedInstanceShape)),
    }),
  }),
};

CredentialsTable.defaultProps = {
  sharedInstancesConfiguration: {
    splunk: [],
    jira: [],
  },
};

export default CredentialsTable;
