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
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CredentialsModificationDialog from './CredentialsModificationDialog';
import { SettingsContext } from './SettingsContext';
import SharedInstancesConfigurationShape, {
  SharedInstancesConfigurationDefaultValue,
} from '../proptypes/SharedInstancesConfiguration';
import InfoPaper from './InfoPaper';

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
}));

const CredentialsTable = (props) => {
  const { sharedInstancesConfiguration, onCredentialRemoveRequest } = props;
  const classes = useStyles();
  const [isCredentialsModificationDialogOpen, setIsCredentialsModificationDialogOpen] = useState(false);
  const [indexOfCredentialToPossiblyDelete, setIndexOfCredentialToPossiblyDelete] = useState(null);
  const [isCredentialDeletionWarningOpen, setIsCredentialDeletionWarningOpen] = useState(false);
  const { credentials, actions } = useContext(SettingsContext);

  return (
    <>
      {credentials.length === 0 ? (
        <InfoPaper
          Icon={DescriptionOutlinedIcon}
          header="No Credentials Saved"
          subheader='Click "Add Credential" to get started'
        />
      ) : (
        <Paper className={classes.root}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Instance(s) Associated To</TableCell>
                <TableCell style={{ textAlign: 'end' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credentials.map((credentialEntry, index) => (
                // eslint-disable-next-line react/no-array-index-key
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
                  <TableCell>
                    <IconButton
                      style={{ float: 'right' }}
                      onClick={() => {
                        setIndexOfCredentialToPossiblyDelete(index);
                        setIsCredentialDeletionWarningOpen(true);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
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
          actions.addCredentialEntry({
            username: values.username,
            password: values.password,
            associatedTo: [...values.selectedJiraInstances, ...values.selectedSplunkInstances],
          });
          setIsCredentialsModificationDialogOpen(false);
        }}
        sharedInstancesConfiguration={sharedInstancesConfiguration}
      />
      <Dialog open={isCredentialDeletionWarningOpen} aria-labelledBy="delete-credential-dialog-title">
        <DialogTitle id="delete-credential-dialog-title">Delete Credential Warning</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this credential? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsCredentialDeletionWarningOpen(false);
            }}
            color="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onCredentialRemoveRequest(indexOfCredentialToPossiblyDelete);
              setIsCredentialDeletionWarningOpen(false);
            }}
            color="secondary"
            autoFocus
          >
            Delete Credential
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => setIsCredentialsModificationDialogOpen(true)} className={classes.addCredentialsButton}>
        <AddIcon />
        Add Credential
      </Button>
    </>
  );
};

CredentialsTable.propTypes = {
  sharedInstancesConfiguration: SharedInstancesConfigurationShape,
  onCredentialRemoveRequest: PropTypes.func,
};

CredentialsTable.defaultProps = {
  sharedInstancesConfiguration: SharedInstancesConfigurationDefaultValue,
  onCredentialRemoveRequest: () => {},
};

export default CredentialsTable;
