import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  position: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  isPrimary: Yup.boolean(),
  notes: Yup.string()
});

const ContactManagement = ({ customerId, contacts, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteContactId, setDeleteContactId] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingContact) {
        await onUpdateContact(customerId, editingContact.id, values);
      } else {
        await onAddContact(customerId, values);
      }
      resetForm();
      setOpenDialog(false);
      setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await onDeleteContact(customerId, deleteContactId);
      setDeleteContactId(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Contacts
      </Typography>
      <Divider />

      <Box mt={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Contact
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Primary</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.position}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.isPrimary ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(contact)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteContactId(contact.id)}>
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        <Formik
          initialValues={{
            name: editingContact?.name || '',
            position: editingContact?.position || '',
            email: editingContact?.email || '',
            phone: editingContact?.phone || '',
            isPrimary: editingContact?.isPrimary || false,
            notes: editingContact?.notes || ''
          }}
          validationSchema={contactSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Full Name"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="position"
                      label="Position"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="phone"
                      label="Phone"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="notes"
                      label="Notes"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Dialog
        open={Boolean(deleteContactId)}
        onClose={() => setDeleteContactId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this contact?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteContactId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactManagement;