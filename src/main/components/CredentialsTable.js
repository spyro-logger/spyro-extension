import React, { useState } from 'react';
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

import CredentialsModificationDialog from './CredentialsModificationDialog';

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

const rows = [
  {
    username: 'dv297',
    instances: ['jira1', 'jira2'],
  },
  {
    username: 'singleton06',
    instances: ['splunk1'],
  },
];

const CredentialsTable = () => {
  const classes = useStyles();
  const [isCredentialsModificationDialogOpen, setIsCredentialsModificationDialogOpen] = useState(false);

  return (
    <>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Credential Username</TableCell>
              <TableCell>Instance(s) Associated To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell>
                  {row.instances.map((instance) => (
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
      <CredentialsModificationDialog
        isOpen={isCredentialsModificationDialogOpen}
        onCancel={() => setIsCredentialsModificationDialogOpen(false)}
        onSave={() => setIsCredentialsModificationDialogOpen(false)}
      />
      <Button onClick={() => setIsCredentialsModificationDialogOpen(true)} className={classes.addCredentialsButton}>
        <AddIcon />
        Add Credential
      </Button>
    </>
  );
};

export default CredentialsTable;
